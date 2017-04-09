const test = require('ava')
const request = require('supertest')
require('../initServer')

test.before((t) => (
  serverPromise
))

test('get non defined route', (t) => (
  request(server.listener)
    .get('/undefinedurl')
    .expect(404)
    .then((res) => {
      t.is(res.body.result, 'Page not found.')
    })
))

