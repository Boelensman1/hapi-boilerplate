require('./init')

const { argv } = require('optimist')

const { adress, port } = argv

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


/* eslint-disable no-console */
/* istanbul ignore next */
if (argv.createAdmin) {
  // add the extra dependencies
  const models = require('./models')
  const readline = require('readline')

  // check if we currently have no admin
  models.init().then(() => {
    models.admin.count().then((result) => {
      if (result !== 0) {
        console.log('Can only create an admin this way when there are none.')
        process.exit(1)
      }
      // create a readline interface for asking username & passwd
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })
      console.log('creating new admin account')
      rl.question('Username: ', (username) => {
        askHidden(rl, 'Password: ', (password) => {
          rl.close()
          // create the admin account
          models.admin.create({
            userName: username,
            password,
          }).then(() => {
            console.log('Created admin account')
            process.exit(0)
          }).catch(console.log)
        })
      })
    })
  })
} else {
  // start the server
  require('./server.js').run(adress, port)
}
/* eslint-enable no-console */
