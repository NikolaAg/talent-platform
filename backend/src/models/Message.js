const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  messageType: {
    type: DataTypes.ENUM('text', 'image', 'file'),
    defaultValue: 'text'
  },
  fileUrl: {
    type: DataTypes.STRING
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Message;
