const { insertIdColumn } = require('../util')

exports.up = (knex) =>
  knex.schema.createTable('posts', (table) => {
    insertIdColumn(table)
    table.string('title')
    table.string('author')
    table.text('contents')
    table.bigInteger('createdAt').notNullable()
    table.bigInteger('updatedAt')
  })

exports.down = (knex) => knex.schema.dropTable('posts')
