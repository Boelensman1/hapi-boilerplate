module.exports = {
  description: 'The catch-all 404 endpoint',
  tags: ['private'],
  handler(request, reply) {
    return reply({ result: 'Page not found.' }).code(404)
  },
}
