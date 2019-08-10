const Joi = require('@hapi/joi')
const { responseValidation } = require('models/role')

module.exports = {
  get: {
    description: 'List all roles on the server',
    tags: ['api', 'role'],
    response: {
      schema: Joi.array().items(responseValidation),
      modify: true,
    },
    plugins: {
      hapiCrudAcl: {
        permissions: ['roles:read'],
      },
    },
    async handler(request, h) {
      const { ioc } = request.server.app
      const Role = ioc.resolve('models').role

      const roles = await Role.query()
      return h.response(roles).code(200)
    },
  },
}
