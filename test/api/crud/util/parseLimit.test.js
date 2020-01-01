const { parseRange } = require('api/crud/util')

describe('Test parseRange util function', () => {
  test('Get correct range from query', async () => {
    const { rangeStart, rangeEnd } = parseRange({ range: [0, 24] })
    expect(rangeStart).toBe(0)
    expect(rangeEnd).toBe(24)
  })
  test('Get correct default range', async () => {
    const { rangeStart, rangeEnd } = parseRange()
    expect(rangeStart).toBe(0)
    expect(rangeEnd).toBe(30)
  })
  test('Errors on invalid range', async () => {
    expect(() => parseRange({ range: [10, 0] })).toThrowError('range')
  })
})
