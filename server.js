const config = require('config')
const glue = require('glue')

/**
 * Create the server
 *
 * @param {object} manifest The serverconfig
 * @returns {object} The hapi server object
 */
function createServer(manifest) {
  return new Promise((resolve, reject) => {
    glue.compose(manifest, { relativeTo: __dirname }, (err, server) => {
      if (err) {
        reject(err)
      } else {
        resolve(server)
      }
    })
  })
}

module.exports = createServer

if (!module.parent) {
  createServer(config.manifest).then((server) => {
    server.start(() => {
      console.log(`✅  Server is listening on ${server.info.uri.toLowerCase()}`)
    })
  })
}
