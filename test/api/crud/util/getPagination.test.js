const { getPagination } = require('api/crud/util')
const config = require('config')

const baseUrl = `${config.get('baseUrl')}/crud/contact/`

// generate range URI encoded, %2C = ,
const r = (start, end) => `[${start}%2C${end}]`

describe('Test getPagination util function', () => {
  test('Get correct next and previous', () => {
    const model = { name: 'Contact' }

    // Only a next page
    let pagination = getPagination(model, 319, { range: [0, 24] })
    expect(pagination.count).toBe(319)
    expect(decodeURI(pagination.next)).toBe(`${baseUrl}?range=${r(24, 48)}`)
    expect(pagination.previous).toBeUndefined()

    // Next page and previous page
    pagination = getPagination(model, 319, { range: [24, 48] })
    expect(pagination.count).toBe(319)
    expect(decodeURI(pagination.next)).toBe(`${baseUrl}?range=${r(48, 72)}`)
    expect(decodeURI(pagination.previous)).toBe(`${baseUrl}?range=${r(0, 24)}`)

    // Only a previous page
    pagination = getPagination(model, 319, { range: [300, 330] })
    expect(pagination.count).toBe(319)
    expect(pagination.next).toBeUndefined()
    expect(decodeURI(pagination.previous)).toBe(
      `${baseUrl}?range=${r(270, 300)}`,
    )
  })
})
