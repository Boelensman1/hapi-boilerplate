const genColumns = (dbQuery, model) => {
  let result = []
  const joins = {}
  Object.keys(model.searchableAttributes).forEach((relation) => {
    const attributes = model.searchableAttributes[relation]
    if (relation === '$self') {
      // not a relation, this is the model itself
      result = result.concat(
        attributes.map((a) => `to_tsvector("${model.tableName}"."${a}")`),
      )
    } else {
      joins[relation] = true
      const relationModel = require(model.relationMappings[relation].modelClass)
      result = result.concat(
        attributes.map(
          (a) => `to_tsvector("${relationModel.tableName}"."${a}")`,
        ),
      )
    }
  })
  return { query: result.join(' || '), joins }
}

const addSearch = (dbQuery, model, filter) => {
  const { query, joins } = genColumns(dbQuery, model)
  dbQuery.whereRaw(
    `${query} @@ to_tsquery('english', ?)`,
    filter.search
      .trim()
      .split(' ')
      .join(' <-> '),
  )
  dbQuery.joinRelated(joins)
}

module.exports = addSearch
