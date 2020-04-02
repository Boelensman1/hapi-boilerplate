const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const responseSchema = require('util/responseSchema')
const lwr = require('../../util').lowerFirstLetter

module.exports = (
  modelName,
  relationName,
  { name, responseValidation, defaultAttributes },
) => ({
  description: `Get a relation between ${modelName} and ${lwr(name)}`,
  tags: ['api', 'crud', modelName],
  validate: {
    params: Joi.object({
      id: Joi.number().min(0),
    }),
  },
  response: {
    schema: responseSchema(Joi.array().single().items(responseValidation)),
  },
  plugins: {
    hapiCrudAcl: {
      permissions: [`${modelName}:read`, `${lwr(relationName)}:read`],
    },
  },
  async handler(request, h) {
    const { ioc } = request.server.app
    const model = ioc.resolve('models')[modelName]

    const {
      params: { id },
    } = request

    const parent = await model.query().findById(id)

    if (!parent) {
      throw Boom.notFound(`No ${modelName} with this id exists`)
    }

    const dbQuery = parent.$relatedQuery(relationName)

    // check if we should only select some attributes
    if (defaultAttributes) {
      dbQuery.select(defaultAttributes)
    }

    let result = await dbQuery
    const isArray = Array.isArray(result)
    if (!result || (isArray && !result.length)) {
      throw Boom.notFound(
        `${modelName} does not have a relation with ${relationName}`,
      )
    }

    result = isArray ? result.map((r) => r.toJSON()) : result.toJSON()
    return h.response({ result, statusCode: 200 })
  },
})
