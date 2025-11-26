import express, { json } from 'express';
import cors from 'cors';
require('dotenv').config();

import { testConnection } from './database/connection';
import { disconnect, connect } from './redis/client';
import userRoutes from './routes/users';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(json());

// Подключение роутов
app.use('/users', userRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const health = await require('./services/userService').healthCheck();
    res.json(health);
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      service: 'Users Service',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Users Service shutting down gracefully...');
  await disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Users Service shutting down gracefully...');
  await disconnect();
  process.exit(0);
});

// Инициализация и запуск сервера
const startServer = async () => {
  try {
    // Тестируем подключение к БД
    await testConnection();
    
    // Подключаемся к Redis
    await connect();
    
    // Запускаем сервер
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Users Service running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start Users Service:', error);
    process.exit(1);
  }
};

startServer();

export default app;