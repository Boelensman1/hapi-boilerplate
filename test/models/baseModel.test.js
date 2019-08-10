const initModels = require('test/models/initModels')
const BaseModel = require('models/baseModel')

class SimpleModel extends BaseModel {
  static get tableName() {
    return 'simpleModel'
  }
}

const setup = async (model) => {
  const knex = await initModels()
  await knex.schema.createTable('simpleModel', (table) => {
    table.increments()
    table.timestamp('createdAt')
    table.timestamp('updatedAt')
  })

  return model.bindKnex(knex)
}

describe('Test the basemodel', () => {
  test('Inserting', async () => {
    const Simple = await setup(SimpleModel)

    const simple = await Simple.query().insert({})
    expect(simple).toBeInstanceOf(Simple)

    // createdAt should be less then 2 seconds ago
    expect((new Date(simple.createdAt) - new Date()) < 2).toBe(true)
    expect(simple.updatedAt).toBe(undefined)
  })

  test('Updating', async () => {
    const Simple = await setup(SimpleModel)

    const simple = await Simple.query().insert({})

    await simple.$query().update({})
    // updatedAt should be defined and be less then 2 seconds ago
    expect((new Date(simple.updatedAt) - new Date()) < 2).toBe(true)
    // updatedAt should be later then the creation time
    expect(new Date(simple.updatedAt) > new Date(simple.createdAt)).toBe(true)
  })
})
