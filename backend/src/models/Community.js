const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Community = sequelize.define('Community', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  logo: {
    type: DataTypes.STRING
  },
  tags: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  category: {
    type: DataTypes.ENUM(
      'ai',           // ИИ в машиностроении
      'digital_twins', // Цифровые двойники
      'robotics',     // Роботизированная сварка
      'genetics',     // Генная инженерия
      'chemistry',    // Молекулярная химия
      'microchips',   // Микросхемы
      'other'         // Другое
    ),
    defaultValue: 'other'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  memberCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: true
  }
});

module.exports = Community;
