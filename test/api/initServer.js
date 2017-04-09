const config = require('config')
const createServer = require('../../server').createServer


global.serverPromise = createServer(config.manifest).then((srv) => (
  srv.initialize().then(() => {
    global.server = srv
  })
))
