const test = require('ava')
const initModels = require('./initModels')
const BaseModel = require('../../models/baseModel')

class SimpleModel extends BaseModel {
  static get tableName() {
    return 'simpleModel'
  }
}

test.beforeEach((t) => (
  initModels().then((knex) => (
    knex.schema.createTable('simpleModel', (table) => {
      table.increments()
      table.timestamp('createdAt')
      table.timestamp('updatedAt')
    }).then(() => {
      t.context.Simple = SimpleModel.bindKnex(knex)
    })
  ))
))

test('inserting the basemodel', (t) => {
  const Simple = t.context.Simple

  return Simple
    .query()
    .insert({})
    .then((simple) => {
      t.truthy(simple instanceof Simple)
      // createdAt should be less then 2 seconds ago
      t.truthy((new Date(simple.createdAt) - new Date()) < 2)
      t.is(simple.updatedAt, undefined)
    })
})

test('updating the basemodel', (t) => {
  const Simple = t.context.Simple

  return Simple
    .query()
    .insert({})
    .then((simple) => (
      simple
      .$query()
      .update({})
      .then(() => {
        // updatedAt should now be defined and be less then 2 seconds ago
        t.truthy((new Date(simple.updatedAt) - new Date()) < 2)
        // updatedAt should be later then the creation time
        t.truthy((new Date(simple.updatedAt) > new Date(simple.createdAt)))
      })
    ))
})
