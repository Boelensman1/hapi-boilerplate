const { isManyRelation } = require('../../../util')

const setRelationIds = (result, model, deleteRelations = false) =>
  Object.entries(model.relationMappings).forEach(([name, relation]) => {
    if (isManyRelation(relation)) {
      result[`${name}Ids`] = result[name].map((r) => r.id)
    } else {
      result[`${name}Id`] = result[name] && result[name].id
    }
    if (deleteRelations) {
      delete result[name]
    }
  })

module.exports = (result, model, deleteRelations) => {
  if (Array.isArray(result)) {
    return result.map((r) => setRelationIds(r, model, deleteRelations))
  }

  return setRelationIds(result, model, deleteRelations)
}
