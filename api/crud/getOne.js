const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const responseSchema = require('util/responseSchema')

const { formatResult } = require('./util')

module.exports = (modelName, { responseValidation }) => {
  return {
    description: `Get a single ${modelName}`,
    tags: ['api', 'crud', modelName],
    validate: {
      params: Joi.object({
        id: Joi.number().min(0),
      }),
      query: Joi.object({
        getRelations: Joi.boolean()
          .truthy('1', 1)
          .falsy('0', 0),
      }),
    },
    response: {
      schema: responseSchema(responseValidation),
    },
    plugins: {
      hapiCrudAcl: {
        permissions: [`${modelName}:read`],
      },
    },
    async handler(request, h) {
      const { ioc } = request.server.app
      const model = ioc.resolve('models')[modelName]
      const {
        params: { id },
        query,
      } = request

      const getRelations = query && query.getRelations

      const dbQuery = model
        .query()
        .findById(id)
        .modify('defaultAttributes')

      if (getRelations) {
        const relationExpression = Object.keys(model.relationMappings)
          .map((r) => `${r}(defaultAttributes)`)
          .toString()
        dbQuery.withGraphFetched(`[${relationExpression}]`)
      }

      const result = await dbQuery

      if (!result) {
        throw Boom.notFound(`No ${modelName} with this id exists`)
      }
      return h.response({ result: formatResult(result), statusCode: 200 })
    },
  }
}
