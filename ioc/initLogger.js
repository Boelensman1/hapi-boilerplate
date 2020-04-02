const logger = require('pino')

/**
 * Init the logger
 *
 * @param {string}   minLogLevel  The minimum log level
 * @returns {object} The initd logger instance
 */
function initLogger(minLogLevel) {
  const config = this.resolve('config')
  const log = logger({
    prettyPrint: config.get('log.prettyPrint'),
    redact: ['req.headers.cookie', 'payload.context'],
  })
  if (minLogLevel) {
    log.level = minLogLevel
  } else {
    log.level = config.get('log.level')
  }
  log.debug('Logging setup complete')
  return log
}

module.exports = initLogger
