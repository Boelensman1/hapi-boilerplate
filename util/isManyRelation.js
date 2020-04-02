const isManyRelation = (relation) =>
  relation.relation.name === 'HasManyRelation' ||
  relation.relation.name === 'ManyToManyRelation'

module.exports = isManyRelation
