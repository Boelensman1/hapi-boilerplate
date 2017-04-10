const test = require('ava')
const request = require('supertest')
const randomstring = require('randomstring').generate
const server = require('../initServer')

let listener

test.before((t) => (
  server.then((srv) => {
    listener = srv.listener
  })
))

test('get posts', (t) => (
  request(listener)
    .get('/posts')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
      // should return an array
      t.truthy(res.body instanceof Array)
    })
))

test('insert & then get posts by name', (t) => {
  const post = {
    title: randomstring(7),
    contents: randomstring(),
  }

  return request(listener)
    .post('/posts')
    .send(post)
    .expect('Content-Type', /json/)
    .expect(201)
    .then((res) => {
      // should return the inserted object
      t.truthy(res.body instanceof Object)
      t.truthy(res.body.id)
      t.is(res.body.title, post.title)
      t.is(res.body.contents, post.contents)

      return request(listener)
        .get('/posts')
        .query({ title: post.title })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          t.is(response.body.length, 1)
        })
    })
})

test('validation', (t) => {
  const post = {
    title: randomstring(7),
    // missing contents
  }

  return request(listener)
    .post('/posts')
    .send(post)
    .expect('Content-Type', /json/)
    .expect(400)
    .then((res) => {
      t.truthy(res.body instanceof Object)
      const validationError = res.body.validation
      t.is(validationError.source, 'payload')
      t.deepEqual(validationError.keys, ['contents'])
    })
})
