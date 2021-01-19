const path = require('path')
const setUpCrudTest = require('test/api/setUpCrudTest')
const { role } = require('models')

const seedLocation = path.join(__dirname, 'getList.seed.yaml')

const { getList } = require('api/crud')

describe('Test getList crud function', () => {
  test('Get full list', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getList('role', role).handler.bind(null, request, h)

    const {
      body: { result, pagination },
      headers,
    } = await handler()

    // 5 because of the system role
    expect(headers['Content-Range']).toBe('role 0-5/5')
    expect(result).toHaveLength(5)
    result.forEach((role) =>
      expect(role).toMatchSnapshot({
        createdAt: expect.any(Date),
      }),
    )
    expect(pagination).toMatchSnapshot()
  })

  test('Get full list sorted by id', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getList('role', role).handler.bind(null, request, h)

    request.query = { sort: { field: 'id', order: 'desc' } }

    const {
      body: { result, pagination },
      headers,
    } = await handler()

    // 5 because of the system role
    expect(headers['Content-Range']).toBe('role 0-5/5')
    expect(result).toHaveLength(5)
    expect(result[0].id).toBe(13)
    result.forEach((role) =>
      expect(role).toMatchSnapshot({
        createdAt: expect.any(Date),
      }),
    )
    expect(pagination).toMatchSnapshot()
  })

  test('Get list sorted by a virtual property desc', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getList('post', role).handler.bind(null, request, h)

    request.query = { sort: { field: 'titleWithAuthor', order: 'desc' } }

    const {
      body: { result, pagination },
      headers,
    } = await handler()

    // 2nd property should be first
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe(1)
    expect(pagination).toMatchSnapshot()
    expect(headers['Content-Range']).toBe('post 0-2/2')
  })

  test('Get partial list sorted by virtual property asc', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getList('post', role).handler.bind(null, request, h)

    request.query = {
      sort: { field: 'titleWithAuthor', order: 'asc' },
      range: [0, 1],
    }

    const {
      body: { result, pagination },
      headers,
    } = await handler()

    // 1nd post should be first
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(0)
    expect(pagination).toMatchSnapshot()
    expect(headers['Content-Range']).toBe('post 0-1/2')
  })

  test('Get full list sorted by name', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getList('role', role).handler.bind(null, request, h)

    request.query = { sort: { field: 'name', order: 'asc' } }

    const {
      body: { result, pagination },
      headers,
    } = await handler()

    // 5 because of the system role
    expect(headers['Content-Range']).toBe('role 0-5/5')
    expect(result).toHaveLength(5)
    expect(result[1].name).toBe('nameA') // skip 0 as that's the system role
    result.forEach((role) =>
      expect(role).toMatchSnapshot({
        createdAt: expect.any(Date),
      }),
    )
    expect(pagination).toMatchSnapshot()
  })

  test('Get subrange of list', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getList('role', role).handler.bind(null, request, h)

    request.query = { range: [1, 2] }

    const {
      body: { result, pagination },
      headers,
    } = await handler()

    // 5 because of the system role
    expect(headers['Content-Range']).toBe('role 1-2/5')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(10)
    expect(result[0]).toMatchSnapshot({
      createdAt: expect.any(Date),
    })
    expect(pagination).toMatchSnapshot()
  })

  test('Get filtered list', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getList('role', role).handler.bind(null, request, h)

    request.query = { filter: { id: 10 } }

    const {
      body: { result, pagination },
      headers,
    } = await handler()

    expect(headers['Content-Range']).toBe('role 0-1/1')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(10)
    result.forEach((role) =>
      expect(role).toMatchSnapshot({
        createdAt: expect.any(Date),
      }),
    )
    expect(pagination).toMatchSnapshot()
  })

  test('Filter list by non existing column', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getList('role', role).handler.bind(null, request, h)

    request.query = { filter: { nonexistingcolumn: 1 } }

    await expect(handler()).rejects.toThrowError('no column')
  })

  test('Get filtered list 2', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getList('role', role).handler.bind(null, request, h)

    request.query = { filter: { name: ['nameB', 'nameD'] } }

    const {
      body: { result, pagination },
      headers,
    } = await handler()

    expect(headers['Content-Range']).toBe('role 0-2/2')
    expect(result).toHaveLength(2)
    result.forEach((role) =>
      expect(role).toMatchSnapshot({
        createdAt: expect.any(Date),
      }),
    )
    expect(pagination).toMatchSnapshot()
  })

  test('Get filtered list using isNotNull', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getList('role', role).handler.bind(null, request, h)

    request.query = { filter: { 'updatedAt:isNotNull': true } }

    const {
      body: { result, pagination },
      headers,
    } = await handler()

    expect(headers['Content-Range']).toBe('role 0-1/1')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('nameD')
    expect(result[0]).toMatchSnapshot({
      createdAt: expect.any(Date),
    })
    expect(pagination).toMatchSnapshot()
  })

  test('Get multiple filtered list', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getList('role', role).handler.bind(null, request, h)

    request.query = {
      filter: { name: ['nameB', 'nameD'], id: 13 },
    }

    const {
      body: { result, pagination },
      headers,
    } = await handler()

    expect(headers['Content-Range']).toBe('role 0-1/1')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('nameB')
    expect(result[0]).toMatchSnapshot({
      createdAt: expect.any(Date),
    })
    expect(pagination).toMatchSnapshot()
  })

  test('Get filtered, ranged, sorted list', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getList('role', role).handler.bind(null, request, h)

    request.query = {
      filter: { id: [10, 12, 13] },
      range: [1, 3],
      sort: { field: 'name', order: 'asc' },
    }

    const {
      body: { result, pagination },
      headers,
    } = await handler()

    expect(headers['Content-Range']).toBe('role 1-3/3')
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe(13)
    result.forEach((role) =>
      expect(role).toMatchSnapshot({
        createdAt: expect.any(Date),
      }),
    )
    expect(pagination).toMatchSnapshot()
  })

  test('Get filtered list by not equal', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getList('role', role).handler.bind(null, request, h)

    request.query = { filter: { 'id:neq': 10 } }

    const {
      body: { result, pagination },
      headers,
    } = await handler()

    expect(headers['Content-Range']).toBe('role 0-4/4')
    expect(result).toHaveLength(4)
    result.forEach((r) => {
      expect(r.id).not.toBe(10)
    })
    result.forEach((role) =>
      expect(role).toMatchSnapshot({
        createdAt: expect.any(Date),
      }),
    )
    expect(pagination).toMatchSnapshot()
  })

  test('Filter list by non existing column', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getList('role', role).handler.bind(null, request, h)

    request.query = { filter: { nonexistingcolumn: 1 } }

    await expect(handler()).rejects.toThrowError('no column')
  })

  /*
  test('Get filtered list by relation not equal', async () => {
    const { request, h, seed } = await setUpCrudTest(seedLocation)
    const handler = getList('agencyFeeClaim', agencyFeeClaim).handler.bind(
      null,
      request,
      h,
    )

    request.query = {
      filter: { claim: { 'key:neq': seed.claim[1].key } },
    }

    const {
      body: { result, pagination },
      headers,
    } = await handler()

    expect(headers['Content-Range']).toBe('agencyFeeClaim 0-1/1')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(0)
    result.forEach((agencyFeeClaim) =>
      expect(agencyFeeClaim).toMatchSnapshot({
        createdAt: expect.any(Date),
      }),
    )
    expect(pagination).toMatchSnapshot()
  })
  */

  /*
  test('Get list filtered by relation', async () => {
    const { request, h } = await setUpCrudTest(seedLocation)
    const handler = getList('role', role).handler.bind(
      null,
      request,
      h,
    )

    request.query = { filter: { user: { key: 123457 } } }

    const {
      body: { result, pagination },
      headers,
    } = await handler()

    expect(headers['Content-Range']).toBe('agencyFeeClaim 0-1/1')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
    result.forEach((agencyFeeClaim) =>
      expect(agencyFeeClaim).toMatchSnapshot({
        createdAt: expect.any(Date),
      }),
    )
    expect(pagination).toMatchSnapshot()
  })
  */
})
