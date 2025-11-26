'use strict';

export async function up(queryInterface, Sequelize) {
    // Добавляем административных пользователей
    await queryInterface.bulkInsert('users', [
        {
            email: 'admin@system.ru',
            name: 'System Administrator',
            created_at: new Date('2024-01-01T00:00:00Z'),
            updated_at: new Date('2024-01-01T00:00:00Z')
        },
        {
            email: 'support@company.ru',
            name: 'Support Manager',
            created_at: new Date('2024-01-02T08:00:00Z'),
            updated_at: new Date('2024-01-02T08:00:00Z')
        }
    ], {});

    console.log('Admin users seeded successfully: 2 admin users created');
}
export async function down(queryInterface, Sequelize) {
    // Удаляем административных пользователей
    await queryInterface.bulkDelete('users', {
        email: {
            [Sequelize.Op.in]: [
                'admin@system.ru',
                'support@company.ru'
            ]
        }
    }, {});

    console.log('Admin users removed');
}