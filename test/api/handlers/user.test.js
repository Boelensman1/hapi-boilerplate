const path = require('path')
const request = require('supertest')
const setUpHandlerTest = require('test/api/setUpHandlerTest')

const seedLocation = path.join(__dirname, 'user.seed.yaml')

describe('Test /user route', () => {
  test('Get users', async () => {
    const { listener } = await setUpHandlerTest(seedLocation)

    const response = await request(listener)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200)

    // should return an array
    response.body.forEach((user) => {
      expect(user).toMatchSnapshot({ createdAt: expect.any(String) })
    })
  })

  test('Delete a user', async () => {
    const { listener, models } = await setUpHandlerTest(seedLocation)

    const userCount = (await models.user.query()).length

    const response = await request(listener)
      .delete('/user/10')
      .expect('Content-Type', /json/)
      .expect(200)

    // should return an array
    expect(response.body).toEqual({ result: 'OK' })

    // there should be one less user
    const users = await models.user.query()
    expect(users.length).toBe(userCount - 1)
  })
})
