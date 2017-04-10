const Joi = require('joi')
const Post = require('../../models/post')
const findQuery = require('objection-find')

/* eslint-disable max-len */
const queryValidation = {
  title: Joi.string().description('Filter the posts by title'),
  orderBy: Joi.string().allow(['title', 'id']).description('Sort the posts'),
  orderByDesc: Joi.string().allow(['title', 'id']).description('Reverse sort the posts'),
}
/* eslint-enable */

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
      return reply(findQuery(Post).build(request.query))
    },
  },
}
