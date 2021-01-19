const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const { ForeignKeyViolationError } = require('objection')

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

module.exports = (modelName) => ({
  description: `Delete a single ${modelName}`,
  tags: ['api', 'crud', modelName],
  validate: {
    params: Joi.object({
      id: Joi.number().min(0),
    }),
  },
  plugins: {
    hapiCrudAcl: {
      permissions: [`${modelName}:delete`],
    },
  },
  async handler(request, h) {
    const { ioc } = request.server.app
    const model = ioc.resolve('models')[modelName]
    const {
      params: { id },
    } = request

    let result
    try {
      result = await model.query().deleteById(id)
    } catch (err) {
      if (err instanceof ForeignKeyViolationError) {
        throw Boom.conflict(`${capitalize(modelName)} still has dependencies`)
      }
      throw err
    }
    if (!result) {
      throw Boom.notFound(`No ${modelName} with this id exists`)
    }
    return h.response({ statusCode: 200 })
  },
})
