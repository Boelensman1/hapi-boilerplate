const config = require('config')
const Knex = require('knex')

module.exports = () => {
  const knex = new Knex(config.knex)
  return knex.migrate.latest().then(() => (knex))
}
