// const modelObjects = require('models')
const {
  create,
  getList,
  getOne,
  deleteOne,
  getRelation,
  update,
} = require('./crud')
const { lowerFirstLetter } = require('../util')

const routes = []

const modelObjects = {
  acquisition: require('models/acquisition'),
  contact: require('models/contact'),
  claim: require('models/claim'),
  document: require('models/document'),
  property: require('models/property'),
  agent: require('models/agent'),
  crookCatcherLetter: require('models/crookCatcherLetter'),
  crookCatcherLetterBatch: require('models/crookCatcherLetterBatch'),
  action: require('models/action'),
}

Object.values(modelObjects).forEach((model) => {
  const modelName = lowerFirstLetter(model.name)
  // Create
  routes.push({
    method: 'POST',
    path: `/crud/${modelName}`,
    config: create(modelName, model),
  })
  // Read
  routes.push({
    method: 'GET',
    path: `/crud/${modelName}`,
    config: getList(modelName, model),
  })
  routes.push({
    method: 'GET',
    path: `/crud/${modelName}/{id}`,
    config: getOne(modelName, model),
  })
  Object.keys(model.relationMappings).forEach((key) => {
    const relation = model.relationMappings[key]
    const relationModel = require(relation.modelClass)
    routes.push({
      method: 'GET',
      path: `/crud/${modelName}/{id}/${key}`,
      config: getRelation(modelName, key, relationModel),
    })
  })
  // Update
  routes.push({
    method: 'PUT',
    path: `/crud/${modelName}/{id}`,
    config: update(modelName, model),
  })
  // Delete
  routes.push({
    method: 'DELETE',
    path: `/crud/${modelName}/{id}`,
    config: deleteOne(modelName),
  })
})

module.exports = routes
