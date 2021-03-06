const Status = require('./handlers/status')
const Session = require('./handlers/session')
const NotFound = require('./handlers/notFound')

const crudRoutes = require('./crud').routes

const api = {
  name: 'api',
  version: '0.0.1',
  register(server) {
    server.route([
      /* sessions */
      { method: 'POST', path: '/session', config: Session.post },
      { method: 'GET', path: '/session/current', config: Session.info },

      /* other */
      { method: 'GET', path: '/status', config: Status.standard },
      { method: 'GET', path: '/status/auth', config: Status.auth },
      { method: 'GET', path: '/{path*}', config: NotFound },

      /* crud routes */
      ...crudRoutes,
    ])
  },
}

module.exports = api
