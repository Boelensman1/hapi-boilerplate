const { omit } = require('lodash')

const omitVirtualProperties = (payload, model) => {
  const payloadNoVirtual = omit(payload, model.virtualAttributes)
  Object.keys(model.relationMappings).forEach((key) => {
    const relation = model.relationMappings[key]
    const relationModel = require(relation.modelClass)
    if (payloadNoVirtual[key]) {
      if (Array.isArray(payloadNoVirtual[key])) {
        payloadNoVirtual[key] = payloadNoVirtual[key].map((value) =>
          omitVirtualProperties(value, relationModel),
        )
      } else {
        payloadNoVirtual[key] = omitVirtualProperties(
          payloadNoVirtual[key],
          relationModel,
        )
      }
    }
  })
  return payloadNoVirtual
}
module.exports = omitVirtualProperties
