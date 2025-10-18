const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserEvent = sequelize.define('UserEvent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  status: {
    type: DataTypes.ENUM('registered', 'attended', 'completed'),
    defaultValue: 'registered'
  },
  rating: {
    type: DataTypes.INTEGER
  }
});

module.exports = UserEvent;
