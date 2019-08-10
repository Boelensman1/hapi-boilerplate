const createIoC = require('ioc/create')
const createAdminAccount = require('util/createAdminAccount')

const NODE_ENV = process.env.NODE_ENV || 'development'

/**
 * Startup the server
 *
 * @param {object} ioc The IoC service
 * @returns {Promise} Promise resolving into the hapi server object
 */
function startUpServer(ioc) {
  const config = ioc.resolve('config')
  // start up the server!
  return ioc.resolve('server', config.get('manifest')).then((server) => {
    const log = ioc.resolve('logger')
    return server.start().then(() => {
      server.app.ioc = ioc
      log.info(`✅  Server is listening on ${server.info.uri.toLowerCase()}`)
      const schedule = ioc.resolve('schedule')
      if (NODE_ENV !== 'test') {
        schedule.startSchedule()
      }

      // startup the socket.io server
      ioc.resolve('socket.io', server.listener)

      // check if there are any users, if not, create the default
      const models = ioc.resolve('models')
      return models.user.query()
        .select('id').whereNot({ username: 'SYSTEM' }).limit(1)
        .then((users) => {
          if (users.length === 0) {
            createAdminAccount(ioc)
          }
          // return the getMovies server instance
          return server
        })
    })
  }).catch((err) => {
    try {
      // init logger
      const log = ioc.resolve('logger')

      log.fatal('Error while starting up the server', err)
    } catch (error2) {
      /* eslint-disable no-console */
      console.error('Error while starting up the server', err)
      console.error('Additionaly, error while initialising log', error2)
      /* eslint-enable */
    }
    throw new Error('Error while starting up, check logs for details')
  })
}

module.exports = startUpServer

// check if we're running as a require, if so, don't start up the server
if (!module.parent) {
  startUpServer(createIoC())
}
