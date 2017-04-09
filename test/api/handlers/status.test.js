const test = require('ava')
const request = require('supertest')
require('../initServer')

test.before((t) => (
  serverPromise
))

test.cb('get status', (t) => {
  request(server.listener)
    .get('/status')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      t.ifError(err)
      t.is(res.body.result, 'OK')
      t.end()
    })
})

