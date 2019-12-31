const create = require('./create')
const getList = require('./getList')
const getOne = require('./getOne')
const getRelation = require('./getRelation')
const update = require('./update')
const deleteOne = require('./deleteOne')

const { lowerFirstLetter } = require('../../util')

const routes = []

const modelObjects = {
  post: require('models/post'),
  role: require('models/role'),
  session: require('models/session'),
  user: require('models/user'),
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

module.exports = {
  create,
  getList,
  getOne,
  getRelation,
  update,
  deleteOne,
  routes,
}
