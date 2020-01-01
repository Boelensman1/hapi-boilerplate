const { parseFilter } = require('api/crud/util')

const model = { schema: { title: true, name: true } }

describe('Test parseFilter util function', () => {
  test('Get correct filters from query', () => {
    expect(parseFilter()).toEqual({ where: {}, whereIn: [], whereNotNull: [] })

    expect(parseFilter({ filter: { title: 'bar' } }, model)).toEqual({
      where: {
        title: 'bar',
      },
      whereIn: [],
      whereNotNull: [],
    })

    expect(parseFilter({ filter: { title: ['foo', 'bar'] } }, model)).toEqual({
      where: {},
      whereIn: [
        {
          column: 'title',
          values: ['foo', 'bar'],
        },
      ],
      whereNotNull: [],
    })
  })
  test('Get correct filters from queries with hasProp', () => {
    expect(parseFilter({ filter: { $hasProp: 'title' } }, model)).toEqual({
      where: {},
      whereIn: [],
      whereNotNull: ['title'],
    })
    expect(
      parseFilter({ filter: { $hasProp: ['title', 'name'] } }, model),
    ).toEqual({
      where: {},
      whereIn: [],
      whereNotNull: ['title', 'name'],
    })
  })

  test('Get correct filters from complex queries', () => {
    expect(
      parseFilter({ filter: { title: ['foo', 'bar'], name: 'abc' } }, model),
    ).toEqual({
      where: {
        name: 'abc',
      },
      whereIn: [
        {
          column: 'title',
          values: ['foo', 'bar'],
        },
      ],
      whereNotNull: [],
    })
    expect(
      parseFilter({ filter: { title: ['foo', 'bar'], name: ['abc'] } }, model),
    ).toEqual({
      where: {},
      whereIn: [
        {
          column: 'title',
          values: ['foo', 'bar'],
        },
        {
          column: 'name',
          values: ['abc'],
        },
      ],
      whereNotNull: [],
    })
  })

  test('Errors if model has no such column', () => {
    expect(() => parseFilter({ filter: { abc: 'bar' } }, model)).toThrowError(
      'no column',
    )
    expect(() =>
      parseFilter({ filter: { $hasProp: 'bar' } }, model),
    ).toThrowError('no column')
  })
})
