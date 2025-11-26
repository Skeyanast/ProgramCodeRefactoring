import { findByPk, findAll, create, sequelize } from '../models/User';
import { get, setex, del, isConnected } from '../redis/client';

class UserService {
  constructor() {
    this.redisPrefix = 'user';
  }

  // Получить пользователя по ID с кэшированием
  async getUserById(id) {
    const cacheKey = `${this.redisPrefix}:${id}`;
    
    try {
      // 1. Проверяем кэш
      const cachedUser = await get(cacheKey);
      if (cachedUser) {
        console.log(`✅ User ${id} served from cache`);
        return JSON.parse(cachedUser);
      }

      // 2. Ищем в БД
      const user = await findByPk(id);
      if (!user) {
        return null;
      }

      const userData = user.toJSON();
      
      // 3. Сохраняем в кэш на 5 минут
      await setex(cacheKey, 300, JSON.stringify(userData));
      console.log(`User ${id} saved to cache`);

      return userData;
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  }

  // Получить всех пользователей с кэшированием
  async getAllUsers() {
    const cacheKey = `${this.redisPrefix}s:all`;
    
    try {
      const cachedUsers = await get(cacheKey);
      if (cachedUsers) {
        console.log('✅ All users served from cache');
        return JSON.parse(cachedUsers);
      }

      const users = await findAll({
        order: [['id', 'ASC']]
      });

      const usersData = users.map(user => user.toJSON());
      
      await setex(cacheKey, 300, JSON.stringify(usersData));
      console.log('✅ All users saved to cache');

      return usersData;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  }

  // Создать пользователя
  async createUser(userData) {
    try {
      const user = await create(userData);
      const userJson = user.toJSON();
      
      // Инвалидируем кэш списка пользователей
      await del(`${this.redisPrefix}s:all`);
      console.log('✅ Users list cache invalidated after create');

      return userJson;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  }

  // Обновить пользователя
  async updateUser(id, updates) {
    try {
      const user = await findByPk(id);
      if (!user) {
        return null;
      }

      await user.update(updates);
      const updatedUser = user.toJSON();
      
      // Инвалидируем кэш конкретного пользователя и списка
      await del(`${this.redisPrefix}:${id}`);
      await del(`${this.redisPrefix}s:all`);
      console.log(`User ${id} cache invalidated after update`);

      return updatedUser;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  }

  // Удалить пользователя
  async deleteUser(id) {
    try {
      const user = await findByPk(id);
      if (!user) {
        return null;
      }

      const userData = user.toJSON();
      await user.destroy();
      
      // Инвалидируем кэш
      await del(`${this.redisPrefix}:${id}`);
      await del(`${this.redisPrefix}s:all`);
      console.log(`✅ User ${id} cache invalidated after delete`);

      return userData;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }

  // Проверить здоровье сервиса
  async healthCheck() {
    try {
      // Проверяем подключение к БД
      await sequelize.authenticate();
      
      // Проверяем Redis (если подключен)
      const redisStatus = isConnected ? 'connected' : 'disconnected';
      
      return {
        status: 'OK',
        service: 'Users Service',
        database: 'connected',
        redis: redisStatus,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'ERROR',
        service: 'Users Service',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export default new UserService();