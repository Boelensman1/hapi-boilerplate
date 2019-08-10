/* eslint max-len: [2, 100, 2] */

const Post = require('./handlers/post')
const Status = require('./handlers/status')
const Session = require('./handlers/session')
const NotFound = require('./handlers/notFound')
const User = require('./handlers/user')
const Roles = require('./handlers/roles')

const api = {
  name: 'api',
  version: '0.0.1',
  register(server) {
    server.route([
      /* post */
      { method: 'GET', path: '/posts', config: Post.get },
      { method: 'POST', path: '/posts', config: Post.post },

      /* users */
      { method: 'GET', path: '/users', config: User.get },
      { method: 'DELETE', path: '/user/{id}', config: User.delete },

      /* sessions */
      { method: 'POST', path: '/session', config: Session.post },
      { method: 'GET', path: '/session/current', config: Session.info },

      /* roles */
      { method: 'GET', path: '/roles', config: Roles.get },

      /* other */
      { method: 'GET', path: '/status', config: Status },
      { method: 'GET', path: '/{path*}', config: NotFound },
    ])
  },
}

module.exports = api
