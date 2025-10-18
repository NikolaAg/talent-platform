const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserCommunity = sequelize.define('UserCommunity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  role: {
    type: DataTypes.ENUM('member', 'moderator', 'admin'),
    defaultValue: 'member'
  },
  joinedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = UserCommunity;
