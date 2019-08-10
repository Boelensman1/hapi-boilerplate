const glue = require('@hapi/glue')
const path = require('path')

/**
 * Create the server
 *
 * @param {object} manifest The serverconfig
 * @param {boolean} skipModelsInit Don't initialize the models
 * @returns {Promise} Promise resolving into the hapi server object
 */
async function createServer(manifest, skipModelsInit) {
  let manifestObject = manifest
  if (manifest.util) {
    // needed as otherwise hapi errors about unknown properties like util / get
    manifestObject = manifest.util.toObject(manifest)
  }

  // add error handling
  if (!manifestObject.server.routes.validate) {
    manifestObject.server.routes.validate = {}
  }
  manifestObject.server.routes.validate.failAction = (request, h, err) => {
    // respond with the full error.
    throw err
  }

  if (!skipModelsInit) {
    await this.resolve('knex')
  }
  return glue.compose(manifestObject, { relativeTo: path.resolve(__dirname, '..') })
}

module.exports = createServer
