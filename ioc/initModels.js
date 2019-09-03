const post = require('models/post')
const role = require('models/role')
const session = require('models/session')
const user = require('models/user')

/**
 * Make the first letter of a string lowercase
 *
 * @param {string} string The string to edit
 * @returns {string} The same string but with the first letter lowercase
 */
function lowerFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1)
}

/**
 * Initialise the objection.js models and bind them to knex
 *
 * @returns {object} Object with all the models
 */
function initModels() {
  const knex = this.resolve('knex')

  const modelArray = [post, role, session, user]

  const models = {}
  modelArray.forEach((model) => {
    models[lowerFirstLetter(model.name)] = model.bindKnex(knex)
    model.prototype.getIoc = () => this
  })

  return models
}

module.exports = initModels
