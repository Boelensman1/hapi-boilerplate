const glue = require('@hapi/glue')
const stream = require('stream')
const path = require('path')

const payloadSerializer = (payload) => {
  if (!payload) {
    return payload
  }
  // remove file data
  Object.entries(payload).forEach(([key, value]) => {
    if (Buffer.isBuffer(value) || value instanceof stream.Readable) {
      payload[key] = '<--file-->'
    }
  })
  return payload
}

/**
 * Create the server
 *
 * @param {object} manifest The serverconfig
 * @param {boolean} skipModelsInit Don't initialize the models
 * @param {boolean} enableAuth Enable authentication
 * @param {boolean} registerRoutes Register the server routes
 * @returns {Promise} Promise resolving into the hapi server object
 */
async function createServer(
  manifest,
  skipModelsInit,
  enableAuth,
  registerRoutes,
) {
  let manifestObject = manifest
  if (manifest.util) {
    // needed as otherwise hapi errors about unknown properties like util / get
    manifestObject = manifest.util.toObject(manifest)
  }

  // add cors
  if (!manifestObject.server) {
    manifestObject.server = {}
  }
  if (!manifestObject.server.routes) {
    manifestObject.server.routes = {}
  }
  if (!manifestObject.server.routes.cors) {
    manifestObject.server.routes.cors = {
      origin: ['*'],
      exposedHeaders: ['Content-Range', 'Content-Disposition'],
    }
  }

  // skip trailing slashes
  if (!manifestObject.server.router) {
    manifestObject.server.router = {
      stripTrailingSlash: true,
    }
  }

  // add error handling
  if (!manifestObject.server.routes.validate) {
    manifestObject.server.routes.validate = {}
  }
  manifestObject.server.routes.validate.failAction = (request, h, err) => {
    // respond with the full error.
    throw err
  }

  if (!manifestObject.register) {
    manifestObject.register = {}
  }
  if (!manifestObject.register.plugins) {
    manifestObject.register.plugins = []
  }

  if (registerRoutes) {
    manifestObject.register.plugins.unshift({ plugin: './api' })
  }
  manifestObject.register.plugins.unshift({ plugin: '@hapi/inert' })
  manifestObject.register.plugins.unshift({ plugin: '@hapi/vision' })
  if (enableAuth) {
    manifestObject.register.plugins.unshift({
      plugin: 'plugins/initPermissions',
    })
    manifestObject.register.plugins.unshift({ plugin: 'plugins/initAuth' })
    manifestObject.register.plugins.unshift({ plugin: 'hapi-auth-jwt2' })
  }

  // install logger
  const config = this.resolve('config')
  manifestObject.register.plugins.push({
    plugin: 'hapi-pino',
    options: {
      instance: this.resolve('logger'),
      level: config.get('log.level'),
      logPayload: true,
      serializers: {
        payload: payloadSerializer,
      },
    },
  })

  if (!skipModelsInit) {
    await this.resolve('knex')
  }
  return glue.compose(manifestObject, {
    relativeTo: path.resolve(__dirname, '..'),
    preRegister: (server) => {
      server.app.ioc = this
    },
  })
}

module.exports = createServer
