const config = require('config')
const createServer = require('../../server').createServer


module.exports = createServer(config.manifest).then((srv) => (
  srv.initialize().then(() => (srv))
))
