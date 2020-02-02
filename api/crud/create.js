const Joi = require('@hapi/joi')
const responseSchema = require('util/responseSchema')
const { UniqueViolationError } = require('objection-db-errors')
const { omitId } = require('./util')

module.exports = (modelName, { responseValidation, payloadValidation }) => ({
  description: `Insert a single ${modelName}`,
  tags: ['api', 'crud', modelName],
  validate: {
    payload: Joi.compile(payloadValidation),
  },
  response: {
    schema: responseSchema(responseValidation),
  },
  plugins: {
    hapiCrudAcl: {
      permissions: [`${modelName}:create`, `${modelName}:read`],
    },
  },
  async handler(request, h) {
    const { ioc } = request.server.app
    const model = ioc.resolve('models')[modelName]
    const { payload } = request

    let result
    try {
      result = await model.query().insertAndFetch(omitId(payload, model))
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        return h.response({ statusCode: 409 }).code(409)
      }
      throw err
    }
    return h.response({ result: result.toJSON(), statusCode: 201 }).code(201)
  },
})
