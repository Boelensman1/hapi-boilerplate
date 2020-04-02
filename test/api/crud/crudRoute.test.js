const path = require('path')
const request = require('supertest')
const setUpHandlerTest = require('test/api/setUpHandlerTest')

const seedLocation = path.join(__dirname, 'crudRoute.seed.yaml')

describe('Test the generated crud routes', () => {
  test('Get list', async () => {
    const { listener } = await setUpHandlerTest(seedLocation)

    const {
      body: { result, pagination, statusCode },
    } = await request(listener)
      .get('/crud/role')
      .query({ sort: JSON.stringify({ field: 'id', order: 'desc' }) })
      .query({ filter: JSON.stringify({ id: [11, 13] }) })
      .query({ range: [0, 1] })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect('Content-Range', 'role 0-1/2')

    expect(statusCode).toBe(200)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchSnapshot({
      createdAt: expect.any(String),
    })
    expect(pagination).toMatchSnapshot()
  })
  test('Get filtered list', async () => {
    const { listener } = await setUpHandlerTest(seedLocation)

    const {
      body: { result, pagination, statusCode },
    } = await request(listener)
      .get('/crud/role')
      .query({ filter: JSON.stringify({ id: [11, 13], name: 'nameB' }) })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect('Content-Range', 'role 0-1/1')

    expect(statusCode).toBe(200)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchSnapshot({
      createdAt: expect.any(String),
    })
    expect(pagination).toMatchSnapshot()
  })

  test('Get one', async () => {
    const { listener } = await setUpHandlerTest(seedLocation)

    const {
      body: { result, statusCode },
    } = await request(listener)
      .get('/crud/role/12')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(statusCode).toBe(200)
    expect(result).toMatchSnapshot({
      id: 12,
      createdAt: expect.any(String),
    })

    await request(listener)
      .get('/crud/role/999')
      .expect('Content-Type', /json/)
      .expect(404)
  })

  test('Get one with relations', async () => {
    const { listener } = await setUpHandlerTest(seedLocation)

    const {
      body: { result, statusCode },
    } = await request(listener)
      .get('/crud/user/100')
      .query({ getRelations: true })
      .expect('Content-Type', /json/)
      .expect(200)

    expect(statusCode).toBe(200)
    expect(result).toMatchSnapshot({
      id: 100,
      createdAt: expect.any(String),
      role: {
        createdAt: expect.any(String),
      },
    })
  })

  test('Get relation', async () => {
    const { listener } = await setUpHandlerTest(seedLocation)

    const {
      body: { result, statusCode },
    } = await request(listener)
      .get('/crud/role/10/users')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(statusCode).toBe(200)
    expect(result[0]).toMatchSnapshot({
      createdAt: expect.any(String),
    })

    // role does not exists
    await request(listener)
      .get('/crud/role/999/user')
      .expect('Content-Type', /json/)
      .expect(404)

    // has no such relation
    await request(listener)
      .get('/crud/role/0/nonExistingRelation')
      .expect('Content-Type', /json/)
      .expect(404)
  })

  test('Delete one', async () => {
    const { listener, models } = await setUpHandlerTest(seedLocation)

    const {
      body: { statusCode },
    } = await request(listener)
      .delete('/crud/role/12')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(statusCode).toBe(200)
    const role = await models.role.query().findById(12)
    expect(role).toBeUndefined()
  })

  test('Delete non existing should return 404', async () => {
    const { listener } = await setUpHandlerTest(seedLocation)

    await request(listener)
      .delete('/crud/role/999')
      .expect('Content-Type', /json/)
      .expect(404)
  })

  test('Create one', async () => {
    const { listener, models } = await setUpHandlerTest(seedLocation)

    const payload = {
      name: 'New Role',
    }

    const {
      body: { statusCode, result },
    } = await request(listener)
      .post('/crud/role')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(201)

    expect(statusCode).toBe(201)
    const role = await models.role.query().findById(result.id)
    expect(role).toEqual(expect.objectContaining(payload))
    expect(role).toMatchSnapshot({
      createdAt: expect.any(Date),
    })

    result.createdAt = new Date(result.createdAt)
    expect(result).toEqual(role.toJSON())
  })

  test('Update one', async () => {
    const { listener, models } = await setUpHandlerTest(seedLocation)

    const payload = {
      name: 'New Name',
    }

    const {
      body: { statusCode, result },
    } = await request(listener)
      .put('/crud/role/10')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(statusCode).toBe(200)
    const role = await models.role.query().findById(result.id)
    expect(role).toEqual(expect.objectContaining(payload))
    expect(role).toMatchSnapshot({
      id: 10,
      updatedAt: expect.any(Date),
      createdAt: expect.any(Date),
    })

    result.createdAt = new Date(result.createdAt)
    result.updatedAt = new Date(result.updatedAt)
    expect(result).toEqual(role.toJSON())
  })

  test('Update one with relations', async () => {
    const { listener, seed } = await setUpHandlerTest(seedLocation)

    const payload = {
      name: 'New Name',
      users: [
        {
          id: 100,
          username: 'New UserName',
          passwordHash: seed.user[0].passwordHash,
        },
      ],
    }

    const {
      body: { result, statusCode },
    } = await request(listener)
      .put('/crud/role/10')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(200)

    expect(statusCode).toBe(200)
    expect(result).toMatchSnapshot({
      id: 10,
      name: 'New Name',
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
      users: [
        {
          username: 'New UserName',
          updatedAt: expect.any(String),
          createdAt: expect.any(String),
        },
      ],
    })
  })
})
