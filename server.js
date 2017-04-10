const config = require('config')
const glue = require('glue')
const Knex = require('knex')
const Model = require('objection').Model

const env = process.env.NODE_ENV || 'development'

/**
 * Initializes the knex models
 *
 * @param {object} knexConfig The knex configuration
 * @returns {Promise} Promise that resolves to the knex instance
 */
function initModels(knexConfig) {
  // Initialize knex.
  const knex = new Knex(knexConfig)
  // Bind all Models to a knex instance. If you only have one database in
  // your server this is all you have to do. For multi database systems, see
  // the Model.bindKnex method.
  Model.knex(knex)

  if (env === 'test') {
    // if we're in test, migrate to the latest db
    return knex.migrate.latest().then(() => (knex))
  }
  return Promise.resolve(knex)
}


/**
 * Create the server
 *
 * @param {object} manifest The serverconfig
 * @returns {Promise} Promise resolving into the hapi server object
 */
function createServer(manifest) {
  return initModels(config.knex).then(() => (
    new Promise((resolve, reject) => {
      glue.compose(manifest, { relativeTo: __dirname }, (err, server) => {
        if (err) {
          reject(err)
        } else {
          resolve(server)
        }
      })
    })
  ))
}

module.exports = {
  createServer,
}

// check if we're running as a require, if so, don't start up the server
if (!module.parent) {
  // start up the server!
  createServer(config.manifest).then((server) => {
    server.start(() => {
      console.log(`✅  Server is listening on ${server.info.uri.toLowerCase()}`)
    })
  })
}
