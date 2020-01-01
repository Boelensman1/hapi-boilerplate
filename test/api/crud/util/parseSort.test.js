const { parseSort } = require('api/crud/util')

const model = { schema: { title: true } }

describe('Test parseSort util function', () => {
  test('Get correct sort param from query', async () => {
    expect(parseSort()).toBeUndefined()

    expect(
      parseSort({ sort: { field: 'title', order: 'ASC' } }, model),
    ).toEqual({
      column: 'title',
      order: 'asc',
    })
  })
  test('Errors if model has no such column', async () => {
    expect(() =>
      parseSort({ sort: { field: 'abc', order: 'ASC' } }, model),
    ).toThrowError('no column')
  })
})
