const config = require('config')
const validateJwt = require('util/validateJwt')

const validate = (decoded, request) => (
  new Promise((resolve) => {
    const models = request.server.app.ioc.resolve('models')
    return validateJwt(decoded, models, (valid, credentials) => (
      resolve({
        isValid: valid,
        credentials,
      })
    ))
  })
)

exports.register = (plugin, options, next) => {
  // initialise the authentication
  plugin.auth.strategy('jwt', 'jwt', {
    key: config.get('jwtSecret'),
    validate,
    verifyOptions: {
      algorithms: ['HS256'],
    },
  })

  // apply auth to all routes by default
  plugin.auth.default('jwt')
}

exports.name = 'auth'
