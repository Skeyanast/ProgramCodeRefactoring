'use strict';

export async function up(queryInterface, Sequelize) {
    // Специальные тестовые заказы для проверки агрегации
    await queryInterface.bulkInsert('orders', [
        // Множественные заказы для одного пользователя (ID 1)
        {
            user_id: 1,
            product: 'Test Product A',
            status: 'pending',
            quantity: 1,
            price: 10.50,
            created_at: new Date('2024-01-15T08:00:00Z'),
            updated_at: new Date('2024-01-15T08:00:00Z')
        },
        {
            user_id: 1,
            product: 'Test Product B',
            status: 'delivered',
            quantity: 2,
            price: 25.00,
            created_at: new Date('2024-01-14T12:00:00Z'),
            updated_at: new Date('2024-01-14T16:00:00Z')
        },
        {
            user_id: 1,
            product: 'Test Product C',
            status: 'confirmed',
            quantity: 3,
            price: 15.75,
            created_at: new Date('2024-01-13T15:30:00Z'),
            updated_at: new Date('2024-01-13T15:30:00Z')
        },

        // Пользователь без заказов (ID 6) - для тестирования пустых ответов
        // Заказы с разными статусами для статистики
        {
            user_id: 2,
            product: 'Statistics Test Item',
            status: 'shipped',
            quantity: 5,
            price: 8.99,
            created_at: new Date('2024-01-12T10:00:00Z'),
            updated_at: new Date('2024-01-14T09:00:00Z')
        }
    ], {});

    console.log('Test orders seeded successfully: 4 test orders created');
}
export async function down(queryInterface, Sequelize) {
    // Удаляем тестовые заказы по продуктам
    await queryInterface.bulkDelete('orders', {
        product: {
            [Sequelize.Op.like]: 'Test Product%'
        }
    }, {});

    await queryInterface.bulkDelete('orders', {
        product: 'Statistics Test Item'
    }, {});

    console.log('Test orders removed');
}