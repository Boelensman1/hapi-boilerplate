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
    description: 'List all posts on the server',
    tags: ['post'],
    validate: {
      query: queryValidation,
    },
    handler(request, reply) {
      return reply(findQuery(Post).build(request.query))
    },
  },
  post: {
    description: 'Create a new post on the server',
    tags: ['post'],
    validate: {
      // validate using the scheme defined in the model
      payload: Post.payloadValidation,
    },
    handler(request, reply) {
      return reply(Post.query().insert(request.payload)).code(201)
    },
    response: {
      schema: Post.schema,
    },
  },
}
