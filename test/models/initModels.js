const config = require('config')
const Knex = require('knex')

module.exports = async () => {
  const knex = new Knex(config.knex)
  await knex.migrate.latest()
  return knex
}
