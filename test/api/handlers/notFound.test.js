const test = require('ava')
const request = require('supertest')
const initServer = require('../initServer')

let listener

test.before((t) => (
  initServer().then((srv) => {
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

