const { insertIdColumn } = require('../util')

const NODE_ENV = process.env.NODE_ENV || 'development'

exports.up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    insertIdColumn(table)

    const { client } = knex.client.config
    if (client === 'pg') {
      // case insensitive
      table.specificType('username', 'CITEXT').notNullable().unique()
    } else if (client === 'sqlite3') {
      table
        .specificType('username', 'varchar(255) collate nocase')
        .notNullable()
        .unique()
    } else {
      table.string('username').notNullable().unique()
    }

    table.string('passwordHash').notNullable()
    table.integer('roleId').unsigned().notNullable()
    table.bigInteger('loggedInAt')
    table.bigInteger('createdAt').notNullable()
    table.bigInteger('updatedAt')

    // set foreign keys
    table
      .foreign('roleId')
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })

  const rolePromise = knex('roles')
  if (NODE_ENV !== 'test') {
    // doesn't do anything on sqlite, which knex logs a lot of messages about
    rolePromise.returning('id')
  }
  rolePromise.insert({
    name: 'SYSTEM',
    // if we're testing, set the date to a constant
    createdAt:
      NODE_ENV === 'test' ? new Date(0).getTime() : new Date().getTime(),
  })
  const [roleId] = await rolePromise

  // insert the system user
  await knex('users').insert({
    username: 'SYSTEM',
    passwordHash: '',
    roleId,
    // if we're testing, set the date to a constant
    createdAt:
      NODE_ENV === 'test' ? new Date(0).getTime() : new Date().getTime(),
  })
}

exports.down = (knex) => knex.schema.dropTable('users')
