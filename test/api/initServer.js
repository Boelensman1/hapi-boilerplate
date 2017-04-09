const config = require('config')
const createServer = require('../../server').createServer


if (!global.serverPromise) {
  global.serverPromise = createServer(config.manifest).then((srv) => (
    srv.initialize().then(() => {
      global.server = srv
    })
  ))
}
