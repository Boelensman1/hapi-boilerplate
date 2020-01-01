const seedDatabase = require('test/seedDatabase')
const setUpServer = require('test/api/setUpServer')
const createIoC = require('ioc/create')

/**
 * Do the setup for a handler test
 *
 * @param {string} seedLocation             The absolute path to the seed file
 *                                          that is used to setup the db.
 *                                          Leave empty for no seed
 * @param {boolean} enableAuth              If the authentication plugin should
 *                                          be enabled
 * @returns {Promise} Promise that resolves when done
 */
async function setUpHandlerTest(seedLocation, enableAuth = false) {
  const ioc = createIoC()
  const knex = ioc.resolve('knex')
  const models = ioc.resolve('models')

  // migrate to the latest db
  await knex.migrate.latest()

  const seed = await seedDatabase(models, seedLocation)
  const listener = await setUpServer(ioc, true, enableAuth)
  return {
    ioc,
    seed,
    listener,
    models,
  }
}

module.exports = setUpHandlerTest
