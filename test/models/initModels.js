const config = require('config')

module.exports = () => {
  const Knex = require('knex')

  const knex = new Knex(config.knex)
  // Bind all Models to a knex instance. If you only have one database in
  // your server this is all you have to do. For multi database systems, see
  // the Model.bindKnex method.
  return knex.migrate.latest().then(() => (knex))
}
