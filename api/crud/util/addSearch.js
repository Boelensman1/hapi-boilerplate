const genColumns = (dbQuery, model) => {
  let result = []
  const joins = {}
  Object.keys(model.searchableAttributes).forEach((relation) => {
    const attributes = model.searchableAttributes[relation]
    if (relation === '$self') {
      // not a relation, this is the model itself
      result = result.concat(
        attributes.map((a) => `"${model.tableName}"."${a}"`),
      )
    } else {
      joins[relation] = true
      const relationModel = require(model.relationMappings[relation].modelClass)
      result = result.concat(
        attributes.map((a) => `"${relationModel.tableName}"."${a}"`),
      )
    }
  })
  return { query: `to_tsvector(concat_ws(' ', ${result.join(',')}))`, joins }
}

const addSearch = (dbQuery, model, value) => {
  const { query, joins } = genColumns(dbQuery, model)
  dbQuery.whereRaw(
    `${query} @@ to_tsquery('english', ?)`,
    value
      .trim()
      .split(' ')
      .map((c) => `${c}:*`)
      .join(' <-> '),
  )
  dbQuery.leftJoinRelated(joins)
}

module.exports = addSearch
