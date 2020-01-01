const { getContentRange } = require('api/crud/util')

describe('Test getContentRange util function', () => {
  test('Get correct range from query', () => {
    const model = { name: 'Contact' }

    // normal case
    expect(getContentRange(model, 319, 0, 24)).toBe('contact 0-24/319')

    // range bigger than total
    expect(getContentRange(model, 4, 0, 2)).toBe('contact 0-2/4')

    // range not starting at 0
    expect(getContentRange(model, 60, 24, 24)).toBe('contact 24-48/60')

    // range equal to total, not starting at 0
    expect(getContentRange(model, 5, 2, 3)).toBe('contact 2-5/5')
  })
})
