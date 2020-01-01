const startUpServer = require('../..')

// hapi-good uses too many event listeners
process.stdout.setMaxListeners(process.stdout.getMaxListeners() + 11)

/**
 * Do the setup for a handler test
 *
 * @param {objet} ioc The ioc object
 * @param {boolean} skipModels Wether to skip the model initialisation
 * @param {boolean} enableAuth If the authentication plugin should be enabled
 * @returns {Promise} Promise that resolves when done
 */
async function setUpServer(ioc, skipModels = false, enableAuth = false) {
  if (!skipModels) {
    const knex = ioc.resolve('knex')

    // migrate to the latest db
    await knex.migrate.latest()
  }

  const { listener } = await startUpServer(ioc, enableAuth)
  return listener
}

module.exports = setUpServer
