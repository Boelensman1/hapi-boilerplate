const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')

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

    const result = await model.query().deleteById(id)
    if (!result) {
      throw Boom.notFound(`No ${model} with this id exists`)
    }
    return h.response({ statusCode: 200 })
  },
})
