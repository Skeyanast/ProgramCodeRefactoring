require('dotenv').config();

export const development = {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/users_db',
    dialect: 'postgres'
};
export const production = {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
};