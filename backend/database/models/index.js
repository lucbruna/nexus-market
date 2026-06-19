const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const sequelize = require('../index')

const models = {}
fs.readdirSync(__dirname)
  .filter(f => f !== 'index.js' && f.endsWith('.js'))
  .forEach(f => {
    const model = require(path.join(__dirname, f))(sequelize, Sequelize.DataTypes)
    models[model.name] = model
  })

Object.keys(models).forEach(m => {
  if (models[m].associate) models[m].associate(models)
})

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models
