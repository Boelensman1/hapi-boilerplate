const createIoC = require('ioc/create')
const request = require('supertest')
const setUpServer = require('test/api/setUpServer')

describe('Test status route', () => {
  test('Returns OK', async () => {
    const listener = await setUpServer(createIoC())

    const response = await request(listener)
      .get('/status')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(response.body.result).toEqual('OK')
  })
})
