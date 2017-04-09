const test = require('ava')
const request = require('supertest')
require('../initServer')

test.before((t) => (
  serverPromise
))

test('get status', (t) => (
  request(server.listener)
    .get('/status')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
      t.is(res.body.result, 'OK')
    })
))

