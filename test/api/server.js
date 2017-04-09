const config = require('config')
const createServer = require('../../server')


global.serverPromise = createServer(config.manifest).then((srv) => (
  new Promise((resolve) => {
    srv.initialize(() => {
      resolve()
      global.server = srv
    })
  })
))
