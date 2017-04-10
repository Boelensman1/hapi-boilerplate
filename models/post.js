const Joi = require('joi')
const BaseModel = require('./baseModel')

class Post extends BaseModel {
  static get tableName() {
    return 'posts'
  }

  // used by hapi to validate, see the handler
  static get validation() {
    return {
      title: Joi.string().max(20).required().description('The title of the post, maxlength of 20'),
      contents: Joi.string().max(500).required().description('The contents of the post, maxlength of 500'),
    }
  }
}

module.exports = Post
