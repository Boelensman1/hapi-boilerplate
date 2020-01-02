const modelObjects = require('models')
const { lowerFirstLetter } = require('../util')

/**
 * Initialise the objection.js models and bind them to knex
 *
 * @returns {object} Object with all the models
 */
function initModels() {
  const knex = this.resolve('knex')

  const modelArray = Object.values(modelObjects)

  const models = {}
  modelArray.forEach((model) => {
    models[lowerFirstLetter(model.name)] = model.bindKnex(knex)
    model.prototype.getIoc = () => this
  })

  return models
}

module.exports = initModels
