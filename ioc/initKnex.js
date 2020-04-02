const Knex = require('knex')

/**
 * Initialize the knex connection
 *
 * @returns {object} knex The knex object
 */
function initKnex(crookCatcher) {
  const config = this.resolve('config')
  const knexConfig = config.util.cloneDeep(
    config.get(crookCatcher ? 'crookCatcherKnex' : 'knex'),
  )

  // enable foreign keys for sqlite
  if (config.get('knex.client') === 'sqlite3') {
    if (!knexConfig.pool) {
      knexConfig.pool = {}
    }
    knexConfig.pool.afterCreate = (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb)
    }
  }

  // Initialize knex.
  const knex = new Knex(knexConfig)

  return knex
}

module.exports = initKnex
