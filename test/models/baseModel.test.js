const Joi = require('@hapi/joi')
const setUpModelTest = require('test/models/setUpModelTest')
const BaseModel = require('models/baseModel')

class SimpleModel extends BaseModel {
  static get tableName() {
    return 'simpleModel'
  }

  static get schema() {
    return {
      num: Joi.number().min(0),
    }
  }
}

const setup = async (model) => {
  const { knex } = await setUpModelTest()
  await knex.schema.createTable('simpleModel', (table) => {
    table.increments()
    table.integer('num')
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

  test('Patching', async () => {
    const Simple = await setup(SimpleModel)

    const simple = await Simple.query().insert({ num: 0 })

    await simple.$query().patch({ num: 1 })
    // updatedAt should be defined and be less then 2 seconds ago
    expect((new Date(simple.updatedAt) - new Date()) < 2).toBe(true)
    // updatedAt should be later then the creation time
    expect(new Date(simple.updatedAt) > new Date(simple.createdAt)).toBe(true)
    // test should be updated
    expect(simple.num).toBe(1)
  })

  test('Validation', async () => {
    const Simple = await setup(SimpleModel)

    const e = 'child "num" fails because ["num" must be larger than or equal to 0]'
    await expect(Simple.query().insert({ num: -1 })).rejects.toThrow(e)

    expect(() => {
      Simple.fromJson({ num: -1 })
    }).toThrow(Error)
  })

  test('No Schema', async () => {
    class SimplerModel extends BaseModel {
      static get tableName() {
        return 'simplerModel'
      }
    }
    const Simpler = await setup(SimplerModel)
    const simpler = Simpler.fromJson({ num: -1 })
    // there is nothing to validate against so the object should be created
    expect(simpler).toBeInstanceOf(Simpler)
  })
})
