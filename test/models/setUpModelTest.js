const seedDatabase = require('test/seedDatabase')
const createIoC = require('ioc/create')

/**
 * Do the setup for a model test
 *
 * @param {string} seedLocation The absolute path to the seed file that is
 *                              used to setup the db leave empty for no seed
 * @returns {Promise} Promise that resolves when done
 */
async function setUpModelTest(seedLocation) {
  const ioc = createIoC()
  const knex = ioc.resolve('knex')
  const models = ioc.resolve('models')

  // migrate to the latest db
  await knex.migrate.latest()
  const seed = await seedDatabase(models, seedLocation)
  return {
    seed,
    models,
    knex,
  }
}

module.exports = setUpModelTest
