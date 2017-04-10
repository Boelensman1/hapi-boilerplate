const test = require('ava')
const request = require('supertest')
const server = require('../initServer')

let listener

test.before((t) => (
  server.then((srv) => {
    listener = srv.listener
  })
))

test('get status', (t) => (
  request(listener)
    .get('/status')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
      t.is(res.body.result, 'OK')
    })
))

