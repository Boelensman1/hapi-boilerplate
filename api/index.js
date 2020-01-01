/* eslint max-len: [2, 100, 2] */

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

      /* crud routes */
      ...crudRoutes,

      /* other */
      { method: 'GET', path: '/status', config: Status },
      { method: '*', path: '/{path*}', config: NotFound },
    ])
  },
}

module.exports = api
