module.exports = {
  description: 'Simple endpoint you can use to see if the server is up',
  tags: ['status'],
  notes: [
    'Does not actually check the status,',
    'will just always return OK (if the server is running of course)',
  ],
  handler(request, reply) {
    return reply({ result: 'OK' })
  },
}
