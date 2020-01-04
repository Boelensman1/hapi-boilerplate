const path = require('path')
const setUpCrudTest = require('test/api/setUpCrudTest')
const { role } = require('models')

const seedLocation = path.join(__dirname, 'getOne.seed.yaml')

const { getOne } = require('api/crud')

describe('Test getOne crud function', () => {
  test('Get one', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getOne('role', role).handler.bind(null, request, h)

    request.params = { id: 10 }

    const {
      body: { result },
    } = await handler()

    expect(result).toMatchSnapshot({
      createdAt: expect.any(Date),
    })
  })
  test('Get one with relations', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getOne('role', role).handler.bind(null, request, h)

    request.query = { getRelations: true }
    request.params = { id: 10 }

    const {
      body: { result },
    } = await handler()

    expect(result).toMatchSnapshot({
      createdAt: expect.any(Date),
      users: [
        {
          createdAt: expect.any(Date),
        },
      ],
    })
  })
})
