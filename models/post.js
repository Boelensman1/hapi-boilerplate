const Model = require('objection').Model

class Post extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'posts'
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString()
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString()
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['title', 'contents'],

      properties: {
        id: { type: 'integer' },
        title: { type: 'string', minLength: 2, maxLength: 20 },
        contents: { type: 'string', minLength: 0, maxLength: 400 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    }
  }
}

module.exports = Post
