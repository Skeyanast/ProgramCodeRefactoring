import { Sequelize } from 'sequelize';
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/users.db',
    {
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Users Service: Database connection established successfully.');
    } catch (error) {
        console.error('Users Service: Unable to connect to the database:', error);
        process.exit(1);
    }
};

export default { sequelize, testConnection };