exports.up = (knex) =>
  knex.schema.createTable('posts', (table) => {
    table.increments()
    table.string('title')
    table.string('author')
    table.text('contents')
    table.timestamp('createdAt')
    table.timestamp('updatedAt')
  })

exports.down = (knex) => knex.schema.dropTable('posts')
