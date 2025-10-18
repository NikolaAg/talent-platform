const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true // Для социальной аутентификации
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.ENUM('student', 'company', 'admin'),
    defaultValue: 'student'
  },
  skills: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  bio: {
    type: DataTypes.TEXT
  },
  experience: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  badges: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  vkId: {
    type: DataTypes.STRING,
    unique: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
