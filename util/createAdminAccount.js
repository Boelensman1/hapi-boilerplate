/**
 * just a helper script to create the admin role & user
 *
 * @param {object} ioc The ioc container
 * @returns {Promise} Promise that resolves when done
 */
function createAdminAcount(ioc) {
  const models = ioc.resolve('models')
  const log = ioc.resolve('logger')
  log.info('Creating admin role & account')
  return models.role.query().insert({
    name: 'admin',
    wanted_read: true,
    wanted_write: true,
    wanted_delete: true,

    users_read: true,
    users_write: true,
    users_delete: true,

    registerTokens_read: true,
    registerTokens_write: true,
    registerTokens_delete: true,

    movies_read: true,
    movies_write: true,
    movies_delete: true,

    downloads_read: true,
    downloads_write: true,
    downloads_delete: true,

    possibleDownloads_read: true,
    possibleDownloads_write: true,
    possibleDownloads_delete: true,

    roles_read: true,
    roles_write: true,
    roles_delete: true,

    plex_read: true,
  }).then((role) => (
    role.$relatedQuery('users').insert({
      username: 'Admin',
      password: 'defaultadminpassword',
    })
  ))
}

module.exports = createAdminAcount
