const test = require('ava')
const request = require('supertest')
const randomstring = require('randomstring').generate

require('../initServer')

test.before((t) => (
  serverPromise
))

test('get posts', (t) => (
  request(server.listener)
    .get('/posts')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
      // should return an array
      t.truthy(res.body instanceof Array)
    })
))

