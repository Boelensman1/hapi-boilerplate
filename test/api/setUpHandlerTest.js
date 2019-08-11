const seedDatabase = require('test/seedDatabase')
const setUpServer = require('test/api/setUpServer')
const createIoC = require('ioc/create')
const clone = require('clone')

/**
 * Do the setup for a handler test
 *
 * @param {objet} t The test object (from ava)
 * @param {string} seedLocation The absolute path to the seed file that is
 *                              used to setup the db
 * @param {boolean} enableAuth If the authentication plugin should be enabled
 * @returns {Promise} Promise that resolves when done
 */
async function setUpHandlerTest(seedLocation, enableAuth) {
  const ioc = createIoC()
  if (enableAuth) {
    // re-init config
    const globalConfig = require('config')
    const config = clone(globalConfig, true, undefined, undefined, true)
    config.manifest.register.plugins.push({ plugin: 'hapi-auth-jwt2' })
    config.manifest.register.plugins.push({ plugin: 'plugins/initAuth' })
    ioc.singleton('config', () => (config))
  }

  const knex = ioc.resolve('knex')
  const models = ioc.resolve('models')

  // migrate to the latest db
  await knex.migrate.latest()

  const seed = await seedDatabase(models, seedLocation)
  const listener = await setUpServer(ioc, true)
  return {
    seed,
    listener,
    models,
  }
}

module.exports = setUpHandlerTest
