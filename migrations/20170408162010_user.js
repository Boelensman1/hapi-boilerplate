const NODE_ENV = process.env.NODE_ENV || 'development'

exports.up = (knex) => (
  knex.schema.createTable('users', (table) => {
    table.increments()

    const { client } = knex.client.config
    if (client === 'pg') {
      // case insensitive
      table.specificType('username', 'CITEXT').notNullable().unique()
    } else {
      table.string('username').notNullable().unique()
    }

    table.string('passwordHash').notNullable()
    table.integer('roleId').unsigned().notNullable()
    table.timestamp('loggedInAt')
    table.timestamp('createdAt')
    table.timestamp('updatedAt')

    // set foreign keys
    table.foreign('roleId')
      .references('id').inTable('roles')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  }).then(() => ( // insert the system user
    knex('users').insert({
      id: 0,
      username: 'SYSTEM',
      passwordHash: '',
      roleId: 0,
      // if we're testing, set the date to a constant
      createdAt: (NODE_ENV === 'test' ? new Date(0) : new Date()).toISOString(),
    })
  ))
)

exports.down = (knex) => (
  knex.schema.dropTable('users')
)
