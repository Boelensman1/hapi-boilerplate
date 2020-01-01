const seedDatabase = require('test/seedDatabase')
const createIoC = require('ioc/create')

/**
 * Do the setup for a crud test
 *
 * @param {string} seedLocation             The absolute path to the seed file
 *                                          that is used to setup the db.
 *                                          Leave empty for no seed
 * @returns {Promise} Promise that resolves when done
 */
async function setUpHandlerTest(seedLocation) {
  const ioc = createIoC()
  const knex = ioc.resolve('knex')
  const models = ioc.resolve('models')

  // migrate to the latest db
  await knex.migrate.latest()

  // seed database
  const seed = await seedDatabase(models, seedLocation)

  // mock request object
  const request = {
    server: {
      app: {
        ioc,
      },
    },
  }

  class H {
    constructor() {
      this.headers = {}
      this.responseCode = 200
    }

    response(response) {
      this.body = response
      return this
    }

    header(headerKey, headerValue) {
      this.headers[headerKey] = headerValue
      return this
    }

    code(c) {
      this.responseCode = c
      return this
    }
  }

  const h = new H()

  return {
    ioc,
    seed,
    models,
    request,
    h,
  }
}

module.exports = setUpHandlerTest
