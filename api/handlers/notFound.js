const Boom = require('@hapi/boom')

module.exports = {
  description: 'The catch-all 404 endpoint',
  tags: ['private'],
  auth: false,
  handler() {
    throw Boom.notFound('Endpoint does not exist')
  },
}
