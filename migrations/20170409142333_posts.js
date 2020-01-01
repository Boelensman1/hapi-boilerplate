exports.up = (knex) =>
  knex.schema.createTable('posts', (table) => {
    table.increments()
    table.string('title')
    table.string('author')
    table.text('contents')
    table.bigInteger('createdAt').notNullable()
    table.bigInteger('updatedAt')
  })

exports.down = (knex) => knex.schema.dropTable('posts')
