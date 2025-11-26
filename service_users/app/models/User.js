import { DataTypes } from 'sequelize';
import { sequelize } from '../database/connection';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['email']
    }
  ]
});

// Методы экземпляра
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.created_at;
  delete values.updated_at;
  return values;
};

export default User;