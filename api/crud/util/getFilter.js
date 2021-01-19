// BASED ON: https://github.com/Vincit/objection-find/blob/master/lib/filters.js
const Boom = require('@hapi/boom')

const propertyRef = (column, relation) => {
  if (!relation) {
    return column
  }
  return `__rel_${relation}.${column}`
}

const basicWhere = (fullPropertyName, operator, value) => ({
  column: fullPropertyName,
  operator,
  value,
})

const getFilter = (column, operator, value, relation) => {
  // check if the input is an array and we have to use getIn
  if (Array.isArray(value)) {
    // if the array has length 1 we can just use eq
    if (value.length === 1) {
      ;[value] = value
    } else {
      if (operator !== 'eq') {
        throw Boom.badRequest(`Can't combine operators and multiple values`)
      }
      operator = 'in'
    }
  }

  switch (operator) {
    case 'eq':
      return basicWhere(propertyRef(column, relation), '=', value)

    case 'in':
      return basicWhere(propertyRef(column, relation), 'in', value)

    case 'neq':
      return basicWhere(propertyRef(column, relation), '<>', value)

    case 'lt':
      return basicWhere(propertyRef(column, relation), '<', value)

    case 'lte':
      return basicWhere(propertyRef(column, relation), '<=', value)

    case 'gt':
      return basicWhere(propertyRef(column, relation), '>', value)

    case 'gte':
      return basicWhere(propertyRef(column, relation), '>=', value)

    case 'like':
      return basicWhere(propertyRef(column, relation), 'like', value)

    case 'likeLower':
      return {
        method: 'whereRaw',
        args: [
          'lower(??) like ?',
          [propertyRef(column, relation), value.toLowerCase()],
        ],
      }

    case 'isNull':
      return basicWhere(propertyRef(column, relation), 'is', null)

    case 'isNotNull':
      return basicWhere(propertyRef(column, relation), 'is not', null)

    default:
      throw Boom.badRequest(`Unknown operation ${operator} in ${column}`)
  }
}

module.exports = getFilter
