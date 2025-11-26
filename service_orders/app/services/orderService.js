import { findByPk, findAll, create, count, sequelize } from '../models/Order';
import { get, setex, del, keys, isConnected } from '../redis/client';
import { get as _get } from 'axios';

class OrderService {
  constructor() {
    this.redisPrefix = 'order';
    this.usersServiceUrl = process.env.USERS_SERVICE_URL;
  }

  // Проверка существования пользователя (межсервисная коммуникация)
  async validateUserExists(userId) {
    try {
      const response = await _get(`${this.usersServiceUrl}/users/${userId}`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return false; // Пользователь не существует
      }
      console.error('Error validating user:', error.message);
      // Если сервис пользователей недоступен, пропускаем валидацию
      // В production здесь должна быть более сложная логика
      return true;
    }
  }

  // Получить заказ по ID с кэшированием
  async getOrderById(id) {
    const cacheKey = `${this.redisPrefix}:${id}`;
    
    try {
      // 1. Проверяем кэш
      const cachedOrder = await get(cacheKey);
      if (cachedOrder) {
        console.log(`Order ${id} served from cache`);
        return JSON.parse(cachedOrder);
      }

      // 2. Ищем в БД
      const order = await findByPk(id);
      if (!order) {
        return null;
      }

      const orderData = order.toJSON();
      
      // 3. Сохраняем в кэш на 3 минуты (заказы меняются чаще)
      await setex(cacheKey, 180, JSON.stringify(orderData));
      console.log(`Order ${id} saved to cache`);

      return orderData;
    } catch (error) {
      console.error('Error in getOrderById:', error);
      throw error;
    }
  }

  // Получить все заказы с фильтрацией и кэшированием
  async getAllOrders(filters = {}) {
    const filterKey = JSON.stringify(filters);
    const cacheKey = `${this.redisPrefix}s:all:${Buffer.from(filterKey).toString('base64')}`;
    
    try {
      // Проверяем кэш только если нет фильтров (фильтрованные запросы не кэшируем)
      if (Object.keys(filters).length === 0) {
        const cachedOrders = await get(cacheKey);
        if (cachedOrders) {
          console.log('All orders served from cache');
          return JSON.parse(cachedOrders);
        }
      }

      // Строим условия запроса
      const whereClause = {};
      if (filters.userId) {
        whereClause.user_id = filters.userId;
      }
      if (filters.status) {
        whereClause.status = filters.status;
      }

      const orders = await findAll({
        where: whereClause,
        order: [['created_at', 'DESC']] // Новые заказы первыми
      });

      const ordersData = orders.map(order => order.toJSON());
      
      // Кэшируем только незафильтрованные запросы
      if (Object.keys(filters).length === 0) {
        await setex(cacheKey, 180, JSON.stringify(ordersData));
        console.log('All orders saved to cache');
      }

      return ordersData;
    } catch (error) {
      console.error('Error in getAllOrders:', error);
      throw error;
    }
  }

  // Создать заказ с валидацией пользователя
  async createOrder(orderData) {
    try {
      // Валидируем существование пользователя
      const userExists = await this.validateUserExists(orderData.userId);
      if (!userExists) {
        throw new Error('User not found');
      }

      const order = await create({
        user_id: orderData.userId,
        product: orderData.product,
        quantity: orderData.quantity || 1,
        price: orderData.price || null,
        status: orderData.status || 'pending'
      });

      const orderJson = order.toJSON();
      
      // Инвалидируем кэш
      await this.invalidateOrderCaches();
      console.log('Order caches invalidated after create');

      return orderJson;
    } catch (error) {
      console.error('Error in createOrder:', error);
      if (error.message === 'User not found') {
        throw new Error('Cannot create order: user does not exist');
      }
      throw error;
    }
  }

  // Обновить заказ
  async updateOrder(id, updates) {
    try {
      const order = await findByPk(id);
      if (!order) {
        return null;
      }

      // Если меняется userId, проверяем существование нового пользователя
      if (updates.userId && updates.userId !== order.user_id) {
        const userExists = await this.validateUserExists(updates.userId);
        if (!userExists) {
          throw new Error('User not found');
        }
        updates.user_id = updates.userId;
        delete updates.userId;
      }

      await order.update(updates);
      const updatedOrder = order.toJSON();
      
      // Инвалидируем кэш
      await this.invalidateOrderCaches(id);
      console.log(`Order ${id} cache invalidated after update`);

      return updatedOrder;
    } catch (error) {
      console.error('Error in updateOrder:', error);
      if (error.message === 'User not found') {
        throw new Error('Cannot update order: user does not exist');
      }
      throw error;
    }
  }

  // Удалить заказ
  async deleteOrder(id) {
    try {
      const order = await findByPk(id);
      if (!order) {
        return null;
      }

      const orderData = order.toJSON();
      await order.destroy();
      
      // Инвалидируем кэш
      await this.invalidateOrderCaches(id);
      console.log(`Order ${id} cache invalidated after delete`);

      return orderData;
    } catch (error) {
      console.error('Error in deleteOrder:', error);
      throw error;
    }
  }

  // Инвалидация кэша
  async invalidateOrderCaches(orderId = null) {
    try {
      // Удаляем кэш конкретного заказа
      if (orderId) {
        await del(`${this.redisPrefix}:${orderId}`);
      }
      
      // Удаляем кэш всех заказов и фильтрованных версий
      const allOrdersKeys = await keys(`${this.redisPrefix}s:all:*`);
      for (const key of allOrdersKeys) {
        await del(key);
      }
      
      // Удаляем основной кэш списка
      await del(`${this.redisPrefix}s:all`);
      
      console.log('All order caches invalidated');
    } catch (error) {
      console.error('Error invalidating caches:', error);
    }
  }

  // Статистика заказов
  async getOrderStats() {
    try {
      const totalOrders = await count();
      const ordersByStatus = await findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['status'],
        raw: true
      });

      const recentOrders = await findAll({
        limit: 5,
        order: [['created_at', 'DESC']]
      });

      return {
        total: totalOrders,
        byStatus: ordersByStatus.reduce((acc, item) => {
          acc[item.status] = parseInt(item.count);
          return acc;
        }, {}),
        recent: recentOrders.map(order => order.toJSON())
      };
    } catch (error) {
      console.error('Error in getOrderStats:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      // Проверяем подключение к БД
      await sequelize.authenticate();
      
      // Проверяем Redis
      const redisStatus = isConnected ? 'connected' : 'disconnected';
      
      // Проверяем доступность Users Service
      let usersServiceStatus = 'unknown';
      try {
        await _get(`${this.usersServiceUrl}/health`, { timeout: 3000 });
        usersServiceStatus = 'connected';
      } catch (error) {
        usersServiceStatus = 'disconnected';
      }
      
      return {
        status: 'OK',
        service: 'Orders Service',
        database: 'connected',
        redis: redisStatus,
        users_service: usersServiceStatus,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'ERROR',
        service: 'Orders Service',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export default new OrderService();