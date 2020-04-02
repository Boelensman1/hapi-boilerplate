// check if we're running as a require. If we are not return sentryDSN
if (!module.parent) {
  const config = require('config')
  // eslint-disable-next-line no-console
  console.log(config.get('sentryDSN'))
}
