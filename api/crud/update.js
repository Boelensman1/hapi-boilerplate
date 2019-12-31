const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const responseSchema = require('util/responseSchema')
const { UniqueViolationError } = require('objection-db-errors')
const { omit } = require('lodash')

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

    // get payload & remove virtual properties
    const payload = omit(request.payload, model.virtualAttributes)

    const {
      params: { id },
    } = request

    const instance = await model.query().findById(id)
    if (!instance) {
      throw Boom.notFound(`No ${modelName} with this id exists`)
    }

    // set id from the request path
    payload.id = id

    let result
    try {
      result = await model.query().upsertGraphAndFetch(payload)
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        return h.response({ statusCode: 409 }).code(409)
      }
      throw err
    }
    return h.response({ result: result.toJSON(), statusCode: 200 }).code(200)
  },
})
