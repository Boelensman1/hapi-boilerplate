const hapiCrudAcl = require('hapi-crud-acl')
const permissionsFunc = require('util/permissionsFunc')

module.exports = {
  register: (server, options) => {
    // add the permissionsFunc
    Object.assign(options, { permissionsFunc })
    return hapiCrudAcl.plugin.register(server, options)
  },
}

module.exports.name = 'permissions'
