const createIoC = require('ioc/create')
const request = require('supertest')
const randomstring = require('randomstring').generate
const setUpServer = require('test/api/setUpServer')

describe('Test /post route', () => {
  test('get posts', async () => {
    const listener = await setUpServer(createIoC())
    const response = await request(listener)
      .get('/posts')
      .expect('Content-Type', /json/)
      .expect(200)

    // should return an array
    expect(response.body).toBeInstanceOf(Array)
  })

  test('insert & then get posts by name', async () => {
    const listener = await setUpServer(createIoC())

    const post = {
      title: randomstring(7),
      contents: randomstring(),
    }

    let response = await request(listener)
      .post('/posts')
      .send(post)
      .expect('Content-Type', /json/)
      .expect(201)

    // should return the inserted object
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('id')

    expect(response.body.title).toBe(post.title)
    expect(response.body.contents).toBe(post.contents)

    response = await request(listener)
      .get('/posts')
      .query({ title: post.title })
      .expect('Content-Type', /json/)
      .expect(200)

    expect(response.body.length).toBe(1)
  })

  test('validation', async () => {
    const listener = await setUpServer(createIoC())
    const post = {
      title: randomstring(7),
      // missing contents
    }

    const response = await request(listener)
      .post('/posts')
      .send(post)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(response.body).toBeInstanceOf(Object)

    const validationError = response.body.validation
    expect(validationError.source).toBe('payload')
    expect(validationError.keys).toEqual(['contents'])
  })
})
