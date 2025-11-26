import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'  // Соответствие с именем колонки в БД
  },
  product: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']  // Индекс для быстрого поиска по пользователю
    },
    {
      fields: ['status']   // Индекс для фильтрации по статусу
    }
  ]
});

// Валидация на уровне модели
Order.prototype.validateOrder = function() {
  if (this.quantity < 1) {
    throw new Error('Quantity must be at least 1');
  }
  if (this.price && this.price < 0) {
    throw new Error('Price cannot be negative');
  }
};

// Методы экземпляра
Order.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  
  // Приводим userId к строке для совместимости с API Gateway
  if (values.user_id) {
    values.userId = values.user_id.toString();
    delete values.user_id;
  }
  
  delete values.created_at;
  delete values.updated_at;
  return values;
};

export default Order;