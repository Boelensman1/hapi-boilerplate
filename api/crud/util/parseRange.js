const config = require('config')
const Boom = require('@hapi/boom')

const defaultRange = config.get('defaultRange')

module.exports = (query) => {
  if (!query || !query.range) {
    return defaultRange
  }

  const [rangeStart, rangeEnd] = query.range
  if (rangeEnd < rangeStart) {
    throw Boom.badRequest('Invalid range, end is before start')
  }
  return { rangeStart, rangeEnd }
}
