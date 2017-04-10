const Joi = require('joi')
const Post = require('../../models/post')

const queryValidation = {
  limit: Joi.number().max(50).description('The maximum amount of posts to get'),
  page: Joi.number().description('Which page of posts to get'),
}

module.exports = {
  get: {
    description: 'Simple endpoint you can use to see if the server is up',
    tags: ['status'],
    validate: {
      query: queryValidation,
    },
    notes: [
      `Does not actually check the status,
    will just always return OK (if the server is running of course)`,
    ],
    handler(request, reply) {
      return reply(Post.query())
    },
  },
}
