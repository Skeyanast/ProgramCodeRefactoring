const { usersCircuit, ordersCircuit } = require('../circuits/breakers');

// URL сервисов (в Docker сети)
const USERS_SERVICE_URL = 'http://service_users:8000';
const ORDERS_SERVICE_URL = 'http://service_orders:8000';

class AggregationService {
    // Получить детали пользователя с его заказами
    async getUserDetailsWithOrders(userId) {
        try {
            // Параллельное выполнение запросов к users и orders сервисам
            const userPromise = usersCircuit.fire(`${USERS_SERVICE_URL}/users/${userId}`);
            
            const ordersPromise = ordersCircuit.fire(`${ORDERS_SERVICE_URL}/orders`)
                .then(orders => {
                    // Фильтруем заказы по userId
                    if (Array.isArray(orders)) {
                        return orders.filter(order => order.userId == userId);
                    }
                    return [];
                });

            // Ожидаем завершения обоих запросов
            const [user, userOrders] = await Promise.all([userPromise, ordersPromise]);

            // Если пользователь не найден, возвращаем ошибку
            if (user && user.error === 'User not found') {
                return { error: 'User not found' };
            }

            // Возвращаем агрегированные данные
            return {
                user,
                orders: userOrders
            };
        } catch (error) {
            console.error('Error in getUserDetailsWithOrders:', error);
            throw new Error('Internal server error during data aggregation');
        }
    }
}

module.exports = new AggregationService();