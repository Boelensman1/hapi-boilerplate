const Boom = require('@hapi/boom')

module.exports = (query, model) => {
  if (!query || !query.filter) {
    return { where: {}, whereIn: [], whereNotNull: [] }
  }

  const result = { where: {}, whereIn: [], whereNotNull: [] }
  Object.keys(query.filter).forEach((column) => {
    const value = query.filter[column]

    if (column === '$hasProp') {
      const valueInArray = Array.isArray(value) ? value : [value]
      valueInArray.forEach((val) => {
        if (!model.schema[val]) {
          throw Boom.badRequest(
            `${model.name} has no column ${val} to filter by`,
          )
        }
      })
      result.whereNotNull = valueInArray
      return
    }

    if (column === 'q') {
      result.search = value
      return
    }

    if (column && !model.schema[column]) {
      throw Boom.badRequest(
        `${model.name} has no column ${column} to filter by`,
      )
    }

    if (Array.isArray(value)) {
      result.whereIn.push({
        column,
        values: value,
      })
    } else {
      result.where[column] = value
    }
  })
  return result
}
