const Status = require('./handlers/status')
const NotFound = require('./handlers/notFound')

exports.register = (plugin, options, next) => {
  plugin.route([
    { method: 'GET', path: '/status', config: Status },
    { method: 'GET', path: '/{path*}', config: NotFound },
  ])

  next()
}

exports.register.attributes = {
  name: 'api',
}
