const startUpServer = require('../..')

// hapi-good uses too many event listeners
process.stdout.setMaxListeners(process.stdout.getMaxListeners() + 11)

/**
 * Do the setup for a handler test
 *
 * @param {objet} ioc The ioc object
 * @param {boolean} skipModels Wether to skip the model initialisation
 * @param {boolean} enableAuth If the authentication plugin should be enabled
 * @param {boolean} registerRoutesLate Register the server routes late
 * @returns {Promise} Promise that resolves when done
 */
async function setUpServer(
  ioc,
  skipModels = false,
  enableAuth = false,
  registerRoutesLate = true,
) {
  if (!skipModels) {
    const knex = ioc.resolve('knex')

    // migrate to the latest db
    await knex.migrate.latest()
  }

  const server = await startUpServer(
    ioc,
    skipModels,
    enableAuth,
    !registerRoutesLate,
  )

  if (registerRoutesLate) {
    server.register({ plugin: require('api') })
  }

  return server.listener
}

module.exports = setUpServer
