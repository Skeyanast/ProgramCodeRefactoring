'use strict';

export async function up(queryInterface, Sequelize) {
    // Добавляем демо-пользователей
    await queryInterface.bulkInsert('users', [
        {
            email: 'alice.smith@mail.ru',
            name: 'Alice Smith',
            created_at: new Date('2024-01-10T10:00:00Z'),
            updated_at: new Date('2024-01-10T10:00:00Z')
        },
        {
            email: 'bob.johnson@mail.ru',
            name: 'Bob Johnson',
            created_at: new Date('2024-01-11T11:30:00Z'),
            updated_at: new Date('2024-01-11T11:30:00Z')
        },
        {
            email: 'carol.davis@mail.ru',
            name: 'Carol Davis',
            created_at: new Date('2024-01-12T14:15:00Z'),
            updated_at: new Date('2024-01-12T14:15:00Z')
        },
        {
            email: 'david.wilson@mail.ru',
            name: 'David Wilson',
            created_at: new Date('2024-01-13T09:45:00Z'),
            updated_at: new Date('2024-01-13T09:45:00Z')
        },
        {
            email: 'eve.brown@mail.ru',
            name: 'Eve Brown',
            created_at: new Date('2024-01-14T16:20:00Z'),
            updated_at: new Date('2024-01-14T16:20:00Z')
        }
    ], {});

    console.log('Demo users seeded successfully: 5 users created');
}
export async function down(queryInterface, Sequelize) {
    // Удаляем добавленных пользователей
    await queryInterface.bulkDelete('users', {
        email: {
            [Sequelize.Op.in]: [
                'alice.smith@mail.ru',
                'bob.johnson@mail.ru',
                'carol.davis@mail.ru',
                'david.wilson@mail.ru',
                'eve.brown@mail.ru'
            ]
        }
    }, {});

    console.log('Demo users removed');
}