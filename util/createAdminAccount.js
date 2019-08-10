const readline = require('readline')

/**
 * Ask a question but hide the answer
 * Modified from: http://stackoverflow.com/questions/24037545/how-to-hide-password-in-the-nodejs-console
 *
 * @param {object} rl The readline interface
 * @param {string} query The question
 * @param {function} callback The callback when finished
 * @returns {undefined}
 */
function askHidden(rl, query, callback) {
  const stdin = process.openStdin()
  const onDataHandler = (char) => {
    char += ''
    switch (char) {
      case '\n': case '\r': case '\u0004':
        stdin.removeListener('data', onDataHandler)
        break
      default:
        process.stdout.write(`\x1B[2K\x1B[200D${query}${Array(rl.line.length + 1).join('*')}`)
        break
    }
  }
  process.stdin.on('data', onDataHandler)

  rl.question(query, (value) => {
    rl.history = rl.history.slice(1)
    callback(value)
  })
}

function askUsernamePassword() {
  return new Promise((resolve) => {
    // create a readline interface for asking username & passwd
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question('Username: ', (username) => {
      askHidden(rl, 'Password: ', (password) => {
        rl.close()
        resolve(username, password)
      })
    })
  })
}


/**
 * just a helper script to create the admin role & user
 *
 * @param {object} ioc The ioc container
 * @returns {Promise} Promise that resolves when done
 */
async function createAdminAcount(ioc) {
  const models = ioc.resolve('models')
  const log = ioc.resolve('logger')
  log.info('Creating admin role & account')
  const role = await models.role.query().insert({
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
  })

  // eslint-disable-next-line no-console
  console.log('creating new admin account')
  const { username, password } = askUsernamePassword()
  await role.$relatedQuery('users').insert({
    username,
    password,
  })
}

module.exports = createAdminAcount
