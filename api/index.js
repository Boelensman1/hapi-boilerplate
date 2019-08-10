/* eslint max-len: [2, 100, 2] */

const Post = require('./handlers/post')
const Status = require('./handlers/status')
const NotFound = require('./handlers/notFound')

const api = {
  name: 'api',
  version: '0.0.1',
  register(server) {
    server.route([
      /* post */
      { method: 'GET', path: '/posts', config: Post.get },
      { method: 'POST', path: '/posts', config: Post.post },

      /* other */
      { method: 'GET', path: '/status', config: Status },
      { method: 'GET', path: '/{path*}', config: NotFound },
    ])
  },
}

module.exports = api
