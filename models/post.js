const BaseModel = require('./baseModel')

class Post extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return 'posts'
  }
}

module.exports = Post
