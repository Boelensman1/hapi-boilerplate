const path = require('path')
const setUpCrudTest = require('test/api/setUpCrudTest')
const { user } = require('models')

const seedLocation = path.join(__dirname, 'getRelation.seed.yaml')

const { getRelation } = require('api/crud')

describe('Test getRelation crud function', () => {
  test('Get relation', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)

    request.params = { id: 10 }
    const handler = getRelation('role', 'user', user).handler.bind(
      null,
      request,
      h,
    )
    const {
      body: { result },
    } = await handler()

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchSnapshot({
      createdAt: expect.any(Date),
    })
  })
})
