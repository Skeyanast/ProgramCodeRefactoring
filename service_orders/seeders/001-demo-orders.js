'use strict';

export async function up(queryInterface, Sequelize) {
    // Добавляем демо-заказы (предполагаем пользователей с ID 1-5)
    await queryInterface.bulkInsert('orders', [
        // Заказы для Alice (user_id: 1)
        {
            user_id: 1,
            product: 'MacBook Pro 16"',
            status: 'pending',
            quantity: 1,
            price: 2499.99,
            created_at: new Date('2024-01-15T10:00:00Z'),
            updated_at: new Date('2024-01-15T10:00:00Z')
        },
        {
            user_id: 1,
            product: 'Wireless Mouse',
            status: 'delivered',
            quantity: 2,
            price: 49.99,
            created_at: new Date('2024-01-08T14:30:00Z'),
            updated_at: new Date('2024-01-10T09:15:00Z')
        },
        {
            user_id: 1,
            product: 'USB-C Hub',
            status: 'confirmed',
            quantity: 1,
            price: 89.99,
            created_at: new Date('2024-01-12T16:45:00Z'),
            updated_at: new Date('2024-01-12T16:45:00Z')
        },

        // Заказы для Bob (user_id: 2)
        {
            user_id: 2,
            product: 'Programming Book: Clean Code',
            status: 'delivered',
            quantity: 1,
            price: 39.99,
            created_at: new Date('2024-01-09T11:20:00Z'),
            updated_at: new Date('2024-01-11T13:40:00Z')
        },
        {
            user_id: 2,
            product: 'Mechanical Keyboard',
            status: 'shipped',
            quantity: 1,
            price: 129.99,
            created_at: new Date('2024-01-14T15:10:00Z'),
            updated_at: new Date('2024-01-15T08:30:00Z')
        },

        // Заказы для Carol (user_id: 3)
        {
            user_id: 3,
            product: 'Office Chair Ergonomic',
            status: 'delivered',
            quantity: 1,
            price: 199.99,
            created_at: new Date('2024-01-07T09:00:00Z'),
            updated_at: new Date('2024-01-09T14:20:00Z')
        },
        {
            user_id: 3,
            product: 'Desk Lamp LED',
            status: 'pending',
            quantity: 1,
            price: 29.99,
            created_at: new Date('2024-01-13T17:30:00Z'),
            updated_at: new Date('2024-01-13T17:30:00Z')
        },

        // Заказы для David (user_id: 4)
        {
            user_id: 4,
            product: 'Smartphone Case',
            status: 'confirmed',
            quantity: 3,
            price: 15.99,
            created_at: new Date('2024-01-11T12:15:00Z'),
            updated_at: new Date('2024-01-11T12:15:00Z')
        },

        // Заказы для Eve (user_id: 5)
        {
            user_id: 5,
            product: 'Bluetooth Headphones',
            status: 'cancelled',
            quantity: 1,
            price: 79.99,
            created_at: new Date('2024-01-06T13:45:00Z'),
            updated_at: new Date('2024-01-07T10:30:00Z')
        },
        {
            user_id: 5,
            product: 'Fitness Tracker',
            status: 'delivered',
            quantity: 1,
            price: 59.99,
            created_at: new Date('2024-01-10T08:20:00Z'),
            updated_at: new Date('2024-01-12T11:50:00Z')
        }
    ], {});

    console.log('Demo orders seeded successfully: 10 orders created');
}
export async function down(queryInterface, Sequelize) {
    // Удаляем все демо-заказы
    await queryInterface.bulkDelete('orders', {}, {});

    console.log('Demo orders removed');
}