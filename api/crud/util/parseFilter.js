const Boom = require('@hapi/boom')
const getFilter = require('./getFilter')

// from https://medium.com/javascript-in-plain-english/javascript-check-if-a-variable-is-an-object-and-nothing-else-not-an-array-a-set-etc-a3987ea08fd7
const isObject = (variable) =>
  variable !== undefined && variable !== null && variable.constructor === Object

const isVirtual = () => false

const parseSingleFilter = (key, value, model, relation) => {
  if (isObject(value)) {
    throw Boom.badRequest('Nested relation filters are not supported')
  }

  const column = key.split(':')[0]
  const operator = key.split(':')[1] || 'eq'
  if (!model.schema[column]) {
    throw Boom.badRequest(`${model.name} has no column ${column} to filter by`)
  }
  return getFilter(column, operator, value, relation)
}

module.exports = (query, model) => {
  const result = {
    filters: [],
    virtualFilters: [],
    relations: [],
    search: null,
  }

  if (!query || !query.filter) {
    return result
  }
  Object.entries(query.filter)
    .filter(([key]) => !key.startsWith('_'))
    .forEach(([key, value]) => {
      if (key === 'q') {
        result.search = value
        return
      }

      if (isObject(value)) {
        const relation = model.relationMappings[key]
        if (!relation) {
          throw Boom.badRequest(`${model.name} has no relation ${key}`)
        }
        const relationModel = require(relation.modelClass)

        result.relations.push(key)
        Object.entries(value)
          .filter(([key]) => !key.startsWith('_'))
          .forEach(([relKey, relKalue]) => {
            result.filters.push(
              parseSingleFilter(relKey, relKalue, relationModel, key),
            )
          })
        return
      }

      if (isVirtual(key)) {
        return
      }
      result.filters.push(parseSingleFilter(key, value, model, false))
    })
  return result
}
