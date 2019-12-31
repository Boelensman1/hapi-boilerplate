const Joi = require('@hapi/joi')

const BaseModel = require('models/baseModel')

class Post extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return 'posts'
  }

  static get baseSchema() {
    return {
      id: Joi.number()
        .min(0)
        .description('The identifier of the post'),
      title: Joi.string()
        .max(20)
        .required()
        .description('The title of the post, maxlength of 20'),
      contents: Joi.string()
        .max(500)
        .required()
        .description('The contents of the post, maxlength of 500'),
      author: Joi.string()
        .max(100)
        .required()
        .description('The author of the post, maxlength of 100'),
      createdAt: Joi.date().description('When the post was created'),
      updatedAt: Joi.date().description('When the post was last updated'),
    }
  }

  // used by hapi to validate the payload, see the handler
  static get basePayloadSchema() {
    return {
      title: Post.baseSchema.title,
      contents: Post.baseSchema.contents,
      author: Post.baseSchema.author.optional().default('Anonymous'),
    }
  }

  // used by hapi to validate the response, see the handler
  static get baseResponseSchema() {
    return {
      id: Post.baseSchema.id.required(),
      title: Post.baseSchema.title,
      contents: Post.baseSchema.contents,
      author: Post.baseSchema.author.optional().default('Anonymous'),
      createdAt: Post.baseSchema.createdAt.required(),
      updatedAt: Post.baseSchema.updatedAt,
    }
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {}
  }
}

module.exports = Post
