const Boom = require('@hapi/boom')

module.exports = (query, model) => {
  if (!query || !query.sort) {
    return undefined
  }
  const { field, order } = query.sort

  if (field && !model.schema[field]) {
    throw Boom.badRequest(`${model.name} has no column ${field} to sort by`)
  }

  // check if this is a virtual attribute
  const virtual =
    model.virtualAttributes && model.virtualAttributes.indexOf(field) !== -1

  return { column: field, order: order.toLowerCase(), virtual }
}
