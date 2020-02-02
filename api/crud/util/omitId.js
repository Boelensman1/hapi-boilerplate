const { omit } = require('lodash')

const omitId = (payload, model) => {
  return omit(payload, model.idColumn)
}
module.exports = omitId
