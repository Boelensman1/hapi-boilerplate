const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const responseSchema = require('util/responseSchema')

const { formatResult, setRelationIds } = require('./util')

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
        getRelationIds: Joi.boolean()
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
      const getRelationIds = query && query.getRelationIds

      const dbQuery = model.query().findById(id)

      // if model has defaultAttributes modifier, apply it
      if (model.modifiers && model.modifiers.defaultAttributes) {
        dbQuery.modify('defaultAttributes')
      }

      if (getRelations || getRelationIds) {
        const relationExpression = Object.keys(model.relationMappings)
          .map((r) =>
            // if relation has defaultAttributes modifier, apply it
            r.modifiers && r.modifiers.defaultAttributes
              ? `${r}(defaultAttributes)`
              : r,
          )
          .toString()
        dbQuery.withGraphFetched(`[${relationExpression}]`)
      }

      const result = await dbQuery

      if (getRelationIds) {
        setRelationIds(result, model, !getRelations)
      }

      if (!result) {
        throw Boom.notFound(`No ${modelName} with this id exists`)
      }
      return h.response({ result: formatResult(result), statusCode: 200 })
    },
  }
}
