const test = require('ava')
const request = require('supertest')
const server = require('../initServer')

let listener

test.before((t) => (
  server.then((srv) => {
    listener = srv.listener
  })
))

test('get non defined route', (t) => (
  request(listener)
    .get('/undefinedurl')
    .expect(404)
    .then((res) => {
      t.is(res.body.result, 'Page not found.')
    })
))

