'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
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

    await queryInterface.addIndex('users', ['email'], {
        unique: true,
        name: 'users_email_unique'
    });
}
export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
}