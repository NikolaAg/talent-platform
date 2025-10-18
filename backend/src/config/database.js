const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  {
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
