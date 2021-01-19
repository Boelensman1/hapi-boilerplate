const { parseFilter } = require('api/crud/util')

const model = {
  schema: { title: true, name: true },
  relationMappings: {
    post: {
      modelClass: `${__dirname}/../../../../models/post`,
    },
  },
}

const base = {
  filters: [],
  virtualFilters: [],
  relations: [],
  search: null,
}

describe('Test parseFilter util function', () => {
  test('Get correct filters from query', () => {
    expect(parseFilter()).toEqual(base)

    expect(parseFilter({ filter: { title: 'bar' } }, model)).toEqual({
      ...base,
      filters: [
        {
          column: 'title',
          operator: '=',
          value: 'bar',
        },
      ],
    })

    expect(parseFilter({ filter: { title: ['foo', 'bar'] } }, model)).toEqual({
      ...base,
      filters: [
        {
          column: 'title',
          operator: 'in',
          value: ['foo', 'bar'],
        },
      ],
    })
  })

  test('Get correct filters from queries checking for property', () => {
    expect(parseFilter({ filter: { 'title:isNull': true } }, model)).toEqual({
      ...base,
      filters: [
        {
          column: 'title',
          operator: 'is',
          value: null,
        },
      ],
    })

    expect(
      parseFilter(
        { filter: { 'title:isNull': true, 'name:isNotNull': false } },
        model,
      ),
    ).toEqual({
      ...base,
      filters: [
        {
          column: 'title',
          operator: 'is',
          value: null,
        },
        {
          column: 'name',
          operator: 'is not',
          value: null,
        },
      ],
    })
  })

  test('Get correct filters when using get in', () => {
    expect(
      parseFilter({ filter: { title: ['foo', 'bar'], name: 'abc' } }, model),
    ).toEqual({
      ...base,
      filters: [
        {
          column: 'title',
          operator: 'in',
          value: ['foo', 'bar'],
        },
        {
          column: 'name',
          operator: '=',
          value: 'abc',
        },
      ],
    })
    expect(
      parseFilter({ filter: { title: ['foo', 'bar'], name: ['abc'] } }, model),
    ).toEqual({
      ...base,
      filters: [
        {
          column: 'title',
          operator: 'in',
          value: ['foo', 'bar'],
        },
        {
          column: 'name',
          operator: '=',
          value: 'abc',
        },
      ],
    })
  })

  test('Get correct filters from reference queries', () => {
    expect(
      parseFilter({ filter: { title: 'foo', post: { title: 'abc' } } }, model),
    ).toEqual({
      ...base,
      filters: [
        {
          column: 'title',
          operator: '=',
          value: 'foo',
        },
        {
          column: '__rel_post.title',
          operator: '=',
          value: 'abc',
        },
      ],
      relations: ['post'],
    })
    expect(
      parseFilter(
        { filter: { title: ['foo', 'bar'], post: { title: 'abc' } } },
        model,
      ),
    ).toEqual({
      ...base,
      filters: [
        {
          column: 'title',
          operator: 'in',
          value: ['foo', 'bar'],
        },
        {
          column: '__rel_post.title',
          operator: '=',
          value: 'abc',
        },
      ],
      relations: ['post'],
    })
  })

  test('Errors if model has no such column', () => {
    expect(() => parseFilter({ filter: { abc: 'bar' } }, model)).toThrowError(
      'no column',
    )
    expect(() =>
      parseFilter({ filter: { 'abc:isNull': false } }, model),
    ).toThrowError('no column')
  })

  test('Errors if model has no such relation', () => {
    expect(() =>
      parseFilter({ filter: { testtt: { a: 'bar' } } }, model),
    ).toThrowError('no relation')
  })

  test('Errors if relation has no such column', () => {
    expect(() =>
      parseFilter({ filter: { post: { a: 'bar' } } }, model),
    ).toThrowError('no column')
  })
})
