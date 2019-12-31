const config = require('config')
const qs = require('querystring')

const { lowerFirstLetter } = require('../../../util')

const defaultRange = config.get('defaultRange')
const baseUrl = config.get('baseUrl')

const generateQuery = (props) => {
  const query = {}
  Object.keys(props).forEach((key) => {
    query[key] = JSON.stringify(props[key])
  })
  return qs.encode(query)
}

module.exports = (model, total, oldQuery) => {
  const route = lowerFirstLetter(model.name)

  const query = oldQuery || {}

  const oldStart = query.range ? query.range[0] : defaultRange.rangeStart
  const oldEnd = query.range ? query.range[1] : defaultRange.rangeEnd

  const result = { count: total }

  // check if there is a next page
  if (oldEnd < total) {
    const rangeStart = oldEnd // start where the last one ended
    // And go 1 stepsize (range[1] - range[0]) further
    const rangeEnd = oldEnd + (oldEnd - oldStart)
    query.range = [rangeStart, rangeEnd]
    const queryString = generateQuery(query)
    result.next = `${baseUrl}/crud/${route}/?${queryString}`
  }
  // check if there is a previous page
  if (oldStart > 0) {
    const rangeEnd = oldStart // end where the last one started
    // And go 1 stepsize (range[1] - range[0]) back
    const rangeStart = Math.max(0, oldStart - (oldEnd - oldStart))
    query.range = [rangeStart, rangeEnd]
    const queryString = generateQuery(query)
    result.previous = `${baseUrl}/crud/${route}/?${queryString}`
  }

  return result
}
