const path = require('path')
const request = require('supertest')
const setUpHandlerTest = require('test/api/setUpHandlerTest')

const seedLoc = path.join(__dirname, 'session.seed.yaml')

describe('Test /session route', () => {
  test('Create a session', async () => {
    const { listener, models, seed } = await setUpHandlerTest(seedLoc, true)

    const payload = {
      username: 'testUser1',
      password: 'user test password',
    }

    const response = await request(listener)
      .post('/session')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect('set-cookie', /token/)
      .expect(201)

    expect(response.body.userId).toBe(seed.user[0].id)
    expect(response.body.valid).toBe(true)
    expect(response.body.uid.length).toBe(36)

    const sessions = await models.session.query()
    expect(sessions.length).toBe(1)
  })

  test('post with non existing user', async () => {
    const { listener } = await setUpHandlerTest(seedLoc, true)

    const payload = { username: 'non existing', password: 'user test password' }

    const noCookieHeader = (response) => {
      Object.keys(response.headers).forEach((header) => {
        if (header === 'set-cookie') {
          throw new Error('There should not be a set-cookie header')
        }
      })
    }

    const response = await request(listener)
      .post('/session')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(noCookieHeader)
      .expect(401)

    expect(response.body.message).toBe('Invalid Credentials')
  })

  test('post with wrong password', async () => {
    const { listener } = await setUpHandlerTest(seedLoc, true)

    const payload = {
      username: 'testUser1',
      password: 'not users test password',
    }

    const noCookieHeader = (response) => {
      Object.keys(response.headers).forEach((header) => {
        if (header === 'set-cookie') {
          throw new Error('There should not be a set-cookie header')
        }
      })
    }

    const response = await request(listener)
      .post('/session')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(noCookieHeader)
      .expect(401)

    expect(response.body.message).toBe('Invalid Credentials')
  })

  test('get current', async () => {
    const { listener } = await setUpHandlerTest(seedLoc, true)
    const agent = request.agent(listener)

    // login
    const payload = { username: 'testUser1', password: 'user test password' }

    await agent
      .post('/session')
      .send(payload)
      .expect(201)

    // get current
    const sessionInfo = (await agent.get('/session/current').expect(200)).body
    const userInfo = sessionInfo.user
    delete sessionInfo.user
    expect(sessionInfo).toMatchSnapshot({
      uid: expect.any(String),
      createdAt: expect.any(String),
    })
    expect(userInfo).toMatchSnapshot({
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      loggedInAt: expect.any(Number),
      role: {
        createdAt: expect.any(String),
      },
    })
  })
})
