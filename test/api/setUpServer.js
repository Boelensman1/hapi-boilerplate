const startUpServer = require('../..')

// hapi-good uses too many event listeners
process.stdout.setMaxListeners(process.stdout.getMaxListeners() + 11)

/**
 * Do the setup for a handler test
 *
 * @param {objet} ioc The ioc object
 * @param {boolean} skipModels Wether to skip the model initialisation
 * @returns {Promise} Promise that resolves when done
 */
async function setUpServer(ioc, skipModels = false) {
  if (!skipModels) {
    const knex = ioc.resolve('knex')

    // migrate to the latest db
    await knex.migrate.latest()
  }

  const { listener } = await startUpServer(ioc)
  return listener
}

module.exports = setUpServer
