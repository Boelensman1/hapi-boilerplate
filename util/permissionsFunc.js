const omit = require('lodash.omit')

/**
 * Retrieve permissions for user
 *
 * @param {object} session The session that we're in (supplied by validateJWT)
 * @param {function} callback Callback to call when done
 * @returns {undefined}
 */
function permissionsFunc(session, callback) {
  const role = omit(session.user.role.toJSON(), [
    'id',
    'name',
    'createdAt',
    'updatedAt',
  ])

  const rolePermissions = {}
  Object.keys(role).forEach((key) => {
    const split = key.split('_')
    const resource = split[0]
    const action = split[1]
    if (!rolePermissions[resource]) { rolePermissions[resource] = {} }
    rolePermissions[resource][action] = !!role[key]
  })

  callback(null, rolePermissions)
}

module.exports = permissionsFunc
