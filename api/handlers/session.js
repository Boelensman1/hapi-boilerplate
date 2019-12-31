const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')
const JWT = require('jsonwebtoken')
const aguid = require('aguid')

const responseSchema = require('util/responseSchema')
const { payloadValidation, responseValidation } = require('models/session')
const user = require('models/user')

module.exports = {
  post: {
    description: 'Create a new session',
    tags: ['api', 'session'],
    auth: false,
    validate: {
      // validate using the scheme defined in the model
      payload: Joi.compile(payloadValidation),
    },
    response: {
      schema: responseSchema(responseValidation),
    },
    async handler(request, h) {
      const { ioc } = request.server.app
      const User = ioc.resolve('models').user
      const config = ioc.resolve('config')

      const { username, password } = request.payload

      const user = await User.query()
        .where({ username })
        .first()
      if (!user) {
        throw Boom.unauthorized('Invalid Credentials')
      }

      const valid = await user.checkPassword(password)
      if (!valid) {
        throw Boom.unauthorized('Invalid Credentials')
      }

      const uid = aguid()
      const token = JWT.sign(
        {
          uid,
          exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
        },
        config.get('jwtSecret'),
      )

      // we only care about the inserted session, therefore the [, ...]
      const [, session] = await Promise.all([
        //  update last logged in date
        user.$query().patch({ loggedInAt: new Date().toISOString() }),
        // insert session
        user.$relatedQuery('session').insert({ uid }),
      ])

      h.state('token', token, config.get('cookieOptions'))

      return h.response({ statusCode: 201, result: session }).code(201)
    },
  },
  info: {
    description: 'Get information about your current session',
    tags: ['api', 'session'],
    response: {
      schema: responseSchema({
        ...responseValidation,
        user: user.responseValidation,
      }),
    },
    handler(request, h) {
      const sessionInfo = { ...request.auth.credentials }
      sessionInfo.user = sessionInfo.user.getFiltered()
      return h.response({ statusCode: 200, result: sessionInfo }).code(200)
    },
  },
}
