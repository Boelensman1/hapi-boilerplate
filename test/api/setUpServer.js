const startUpServer = require('../..')

/**
 * Do the setup for a handler test
 *
 * @param {objet} ioc The ioc object
 * @returns {Promise} Promise that resolves when done
 */
async function setUpServer(ioc) {
  const knex = ioc.resolve('knex')

  // migrate to the latest db
  await knex.migrate.latest()

  const { listener } = await startUpServer(ioc)
  return listener
}

module.exports = setUpServer
