const express = require('express');
const cors = require('cors');

// Импортируем роуты
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const aggregationRoutes = require('./routes/aggregation');
const healthRoutes = require('./routes/health');

// Импортируем circuit breakers (для инициализации)
require('./circuits/breakers');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключаем роуты
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use(aggregationRoutes); // Агрегационные роуты без префикса
app.use(healthRoutes); // Health check роуты без префикса

// Обработка 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Обработка ошибок
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;