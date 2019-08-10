const createIoC = require('ioc/create')
const createAdminAccount = require('util/createAdminAccount')

const env = process.env.NODE_ENV || 'development'

/**
 * Startup the server
 *
 * @param {object} ioc The IoC service
 * @returns {Promise} Promise resolving into the hapi server object
 */
async function startUpServer(ioc) {
  try {
    const config = ioc.resolve('config')
    // start up the server!
    const server = await ioc.resolve('server', config.get('manifest'))
    await server.start()
    server.app.ioc = ioc
    server.log(`✅  Server is listening on ${server.info.uri.toLowerCase()}`)

    if (env !== 'test') {
      // check if there are any users, if not, create the default
      const models = ioc.resolve('models')
      const users = await models.user.query()
        .select('id').whereNot({ username: 'SYSTEM' }).limit(1)

      if (users.length === 0) {
        await createAdminAccount(ioc)
      }
    }
    // return the server instance
    return server
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error while starting up the server', error)
    throw new Error('Error while starting up, check logs for details')
  }
}

module.exports = startUpServer

// check if we're running as a require. If we are not, start up the server
if (!module.parent) {
  process.on('unhandledRejection', (err) => {
    // eslint-disable-next-line no-console
    console.log(err)
    process.exit(1)
  })

  startUpServer(createIoC())
}
