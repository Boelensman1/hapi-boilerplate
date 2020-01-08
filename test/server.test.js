const { join } = require('path')

/**
 * Remove port, ip & set autoListen to false for a config
 *
 * @param {object} inputConfig The node-config object to modify
 * @returns {object} The modified node-config object
 */
function doNotListen(inputConfig) {
  const { cloneDeep } = require('config').util
  const config = cloneDeep(inputConfig)
  config.manifest.server.autoListen = false
  delete config.manifest.server.port
  delete config.manifest.server.address
  // after cloning, config loses its functions, need to replace some
  config.knex.get = () => inputConfig.knex
  // apply the new config
  return config
}

const models = (numOfUsers) => ({
  user: {
    query: () => ({
      select: () => ({
        whereNot: () => ({
          limit: jest.fn(() => Promise.resolve(Array(numOfUsers))),
        }),
      }),
    }),
  },
})

beforeEach(() => {
  jest.resetAllMocks()
})

jest.mock('knex', () => jest.fn())
jest.mock('util/createAdminAccount', () => jest.fn(() => Promise.resolve()))

test('Starting up the server', async () => {
  // mock functions
  const ioc = require('ioc/create')()

  const config = ioc.resolve('config')
  const createAdminAccount = require('util/createAdminAccount')

  process.env.NODE_ENV = 'production'
  const productionConfig = doNotListen(
    config.util.loadFileConfigs(join(__dirname, '..', 'config')),
  )

  ioc.singleton('config', () => productionConfig)
  ioc.singleton('models', () => models(0))

  const server = require('server')

  const result = await server(ioc)
  expect(result instanceof Object).toBe(true)
  expect(createAdminAccount).toHaveBeenCalledTimes(1)

  process.env.NODE_ENV = 'test'
})

test('Only creates admin account if there are no users', async () => {
  const ioc = require('ioc/create')()

  const config = ioc.resolve('config')
  const createAdminAccount = require('util/createAdminAccount')

  process.env.NODE_ENV = 'production'
  const productionConfig = doNotListen(
    config.util.loadFileConfigs(join(__dirname, '..', 'config')),
  )

  ioc.singleton('config', () => productionConfig)
  ioc.singleton('models', () => models(2))

  jest.mock('ioc/initModels', () => () => ({
    user: {
      query: () => ({
        select: () => ({
          whereNot: () => ({
            limit: jest.fn(() => Promise.resolve([1, 2])),
          }),
        }),
      }),
    },
  }))

  const server = require('server')

  const result = await server(ioc)
  expect(result instanceof Object).toBe(true)
  expect(createAdminAccount).toHaveBeenCalledTimes(0)

  process.env.NODE_ENV = 'test'
})

test('Starting up the server with errors', async () => {
  const ioc = require('ioc/create')()
  ioc.resolve('logger', 'fatal') // up the log level so we don't see errors

  const config = ioc.resolve('config')

  process.env.NODE_ENV = 'production'
  const productionConfig = doNotListen(
    config.util.loadFileConfigs(join(__dirname, '..', 'config')),
  )

  ioc.singleton('config', () => productionConfig)
  ioc.singleton('models', () => () => {})

  const server = require('server')

  try {
    await server(ioc)
    throw Error('Should not get here')
  } catch (err) {
    expect(err.message).toBe('Error while starting up, check logs for details')
  }
  process.env.NODE_ENV = 'test'
})
