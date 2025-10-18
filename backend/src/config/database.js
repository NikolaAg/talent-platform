const { Sequelize } = require('sequelize');
require('dotenv').config();

// Используем SQLite для разработки в Codespaces
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Файл базы данных
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
