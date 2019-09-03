exports.up = (knex) =>
  knex.schema.createTable('sessions', (table) => {
    table
      .string('uid')
      .notNullable()
      .primary()
    table.boolean('valid').notNullable()
    table
      .integer('userId')
      .unsigned()
      .notNullable()
    table.timestamp('createdAt')
    table.timestamp('updatedAt')

    table
      .foreign('userId')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })

exports.down = (knex) => knex.schema.dropTable('sessions')
