require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/orders_db',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_seeders'
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    seederStorage: 'sequelize', 
    seederStorageTableName: 'sequelize_seeders'
  }
};