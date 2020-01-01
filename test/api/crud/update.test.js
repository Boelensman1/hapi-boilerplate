const path = require('path')
const setUpCrudTest = require('test/api/setUpCrudTest')
const { role, post } = require('models')

const seedLocation = path.join(__dirname, 'update.seed.yaml')

const { update } = require('api/crud')

describe('Test update crud function', () => {
  test('Update', async () => {
    const { request, h, seed } = await setUpCrudTest(seedLocation)

    request.payload = {
      name: 'New Name',
    }
    request.params = { id: seed.role[0].id }

    const handler = update('role', role).handler.bind(null, request, h)
    const {
      body: { result },
    } = await handler()

    expect(result).toMatchSnapshot({
      id: seed.role[0].id,
      name: request.payload.name,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  test('Remove virtual properties', async () => {
    const { request, h, seed } = await setUpCrudTest(seedLocation)

    request.payload = {
      title: 'New Post Title',
      titleWithAuthor: 'Virtual attribute',
    }
    request.params = { id: seed.post[0].id }

    const handler = update('post', post).handler.bind(null, request, h)
    const {
      body: { result },
    } = await handler()

    expect(result).toMatchSnapshot({
      id: seed.post[0].id,
      title: request.payload.title,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  // TODO: this seems to be bugged in objection
  test.skip('Add relation', async () => {
    const { request, h, seed, models } = await setUpCrudTest(seedLocation)

    request.payload = {
      name: 'New Name',
      user: [
        {
          username: 'new user',
          password: 'new password..',
        },
      ],
    }
    request.params = { id: seed.role[0].id }

    const handler = update('role', role).handler.bind(null, request, h)
    const {
      body: { result },
    } = await handler()

    const users = await models.users.query()
    expect(users).toHaveLength(1)
    expect(users[0]).toMatchSnapshot({
      createdAt: expect.any(Date),
    })

    expect(result.users[0]).toMatchSnapshot({
      createdAt: expect.any(Date),
    })
    delete result.users
    expect(result).toMatchSnapshot({
      id: seed.role[0].id,
      name: request.payload.name,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  test('Update to duplicate', async () => {
    const { request, h, seed } = await setUpCrudTest(seedLocation)

    request.payload = {
      name: 'test role dup',
    }
    request.params = { id: seed.role[0].id }

    const handler = update('role', role).handler.bind(null, request, h)
    const { body } = await handler()

    expect(body.statusCode).toBe(409)
    expect(body).toMatchSnapshot()
  })
})
