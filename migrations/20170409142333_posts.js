exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', (table) => {
    table.increments()
    table.string('title')
    table.string('author')
    table.text('contents')
    table.timestamp('createdAt')
    table.timestamp('updatedAt')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('posts')
}
