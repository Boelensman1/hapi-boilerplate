const createIoC = require('ioc/create')
const request = require('supertest')
const setUpServer = require('test/api/setUpServer')

describe('Test 404 route', () => {
  test('Requesting an nonexisting route returns a 404', async () => {
    const listener = await setUpServer(createIoC())

    const response = await request(listener).post('/nonexisting')
    expect(response.status).toEqual(404)
  })
})
