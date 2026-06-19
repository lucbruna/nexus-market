const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  process.env.DB_NAME || 'nexus_market_ai',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: { max: 20, min: 5, acquire: 60000, idle: 10000 },
    dialectOptions: { ssl: process.env.NODE_ENV === 'production' ? { require: true } : false },
  }
)

module.exports = sequelize
