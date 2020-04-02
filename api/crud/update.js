const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const responseSchema = require('util/responseSchema')
const { UniqueViolationError } = require('objection')
const { omitVirtualProperties } = require('./util')

module.exports = (modelName, { responseValidation, schema }) => ({
  description: `Update a single ${modelName}`,
  tags: ['api', 'crud', modelName],
  validate: {
    payload: Joi.compile(schema),
    params: Joi.object({
      id: Joi.number().min(0),
    }),
  },
  response: {
    schema: responseSchema(responseValidation),
  },
  plugins: {
    hapiCrudAcl: {
      permissions: [`${modelName}:update`, `${modelName}:read`],
    },
  },
  async handler(request, h) {
    const { ioc } = request.server.app
    const model = ioc.resolve('models')[modelName]

    let { payload } = request
    const {
      params: { id },
    } = request

    const instance = await model.query().findById(id)
    if (!instance) {
      throw Boom.notFound(`No ${modelName} with this id exists`)
    }

    // set id from the request path
    payload[model.idColumn] = id

    // modify payload to use idColumns
    model.idColumns.forEach(({ key, name, many }) => {
      if (payload[key] !== undefined) {
        if (many) {
          payload[name] = payload[key].map((id) => ({ id }))
        } else if (payload[key] !== null) {
          payload[name] = { id: payload[key] }
        }
        delete payload[key]
      }
    })

    // remove virtual properties
    payload = omitVirtualProperties(request.payload, model)

    let result
    try {
      result = await model.query().upsertGraphAndFetch(payload, {
        relate: true,
        update: true,
        unrelate: true,
      })
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        return h.response({ statusCode: 409 }).code(409)
      }
      throw err
    }
    return h.response({ result: result.toJSON(), statusCode: 200 }).code(200)
  },
})
