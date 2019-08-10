module.exports = {
  description: 'Simple endpoint you can use to see if the server is up',
  tags: ['api', 'status'],
  notes: [
    'Does not actually check the status,',
    'will just always return OK (if the server is running of course)',
  ],
  auth: false,
  handler(request, h) {
    return h.response({ result: 'OK' }).code(200)
  },
}
