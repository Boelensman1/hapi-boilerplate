const hapiRouteAcl = require('hapi-route-acl')
const permissionsFunc = require('util/permissionsFunc')

module.exports = {
  register: (server, options) => {
    // add the permissionsFunc
    Object.assign(options, { permissionsFunc })
    return hapiRouteAcl.plugin.register(server, options)
  },
}

module.exports.name = 'permissions'
