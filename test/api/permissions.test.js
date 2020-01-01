const path = require('path')
const request = require('supertest')
const setUpHandlerTest = require('test/api/setUpHandlerTest')

const seedLoc = path.join(__dirname, 'permissions.seed.yaml')

describe('Test /session route', () => {
  test('Create a session and go to a route we have permission for', async () => {
    const { listener } = await setUpHandlerTest(seedLoc, true)
    const agent = request.agent(listener)

    // create a session
    await agent
      .post('/session')
      .send({
        username: 'testUser1',
        password: 'user test password',
      })
      .expect(201)

    const response = await agent
      .get('/status/auth')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(response.body.result).toEqual('OK')
  })
  test("Create a session and go to a route we don't have permission for", async () => {
    const { listener } = await setUpHandlerTest(seedLoc, true)
    const agent = request.agent(listener)

    // create a session with a role that is not allowed to read /status/auth
    await agent
      .post('/session')
      .send({
        username: 'testUser2',
        password: 'user test password 2',
      })
      .expect(201)

    const { body } = await agent
      .get('/status/auth')
      .expect('Content-Type', /json/)
      .expect(401)

    expect(body.statusCode).toBe(401)
  })
})
