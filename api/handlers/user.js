const Joi = require('@hapi/joi')
const { responseValidation } = require('models/user')
const Boom = require('@hapi/boom')

module.exports = {
  get: {
    description: 'List all users',
    tags: ['api', 'user'],
    response: {
      schema: Joi.array().items(responseValidation),
    },
    plugins: {
      hapiRouteAcl: {
        permissions: ['users:read'],
      },
    },
    async handler(request, h) {
      const { ioc } = request.server.app
      const User = ioc.resolve('models').user

      const users = await User.query()
      return h.response(users.map((user) => (user.getFiltered()))).code(200)
    },
  },
  delete: {
    description: 'Delete a user',
    tags: ['api', 'user'],
    validate: {
      params: {
        id: Joi.number().min(0),
      },
    },
    plugins: {
      hapiRouteAcl: {
        permissions: ['users:delete'],
      },
    },
    async handler(request, h) {
      const { ioc } = request.server.app
      const User = ioc.resolve('models').user

      const { id } = request.params
      const user = await User.query().findById(id)

      if (!user) {
        throw Boom.notFound()
      }

      // delete user
      await user.$query().delete()
      return h.response({ result: 'OK' }).code(200)
    },
  },
}
