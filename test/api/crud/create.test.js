const setUpCrudTest = require('test/api/setUpCrudTest')
const { role } = require('models')

const { create } = require('api/crud')

describe('Test create crud function', () => {
  test('Insert', async () => {
    const { request, h } = await setUpCrudTest()

    request.payload = {
      name: 'Test Role',
    }
    const handler = create('role', role).handler.bind(null, request, h)
    const { body } = await handler()
    expect(body).toMatchSnapshot({
      result: {
        id: expect.any(Number),
        name: expect.any(String),
        createdAt: expect.any(Date),
      },
    })
  })
  test('Insert duplicate', async () => {
    const { request, h } = await setUpCrudTest()

    // same name already exists in db
    request.payload = {
      name: 'Test Role Dup',
    }
    const handler = create('role', role).handler.bind(null, request, h)
    await handler() // insert once
    const { body } = await handler() // insert second time
    expect(body.statusCode).toBe(409)
    expect(body).toMatchSnapshot()
  })
})
