'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Ссылка на таблицу users (в другой БД!)
                key: 'id'
            }
        },
        product: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
            defaultValue: 'pending'
        },
        quantity: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    });

    // Индексы для производительности
    await queryInterface.addIndex('orders', ['user_id']);
    await queryInterface.addIndex('orders', ['status']);
    await queryInterface.addIndex('orders', ['created_at']);
}
export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
}