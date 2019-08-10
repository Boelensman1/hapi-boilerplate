const NODE_ENV = process.env.NODE_ENV || 'development'

exports.up = (knex) => (
  knex.schema.createTable('roles', (table) => {
    table.increments()
    table.string('name').notNullable().unique()

    table.boolean('posts_create').notNullable().defaultTo(false)
    table.boolean('posts_read').notNullable().defaultTo(false)
    table.boolean('posts_update').notNullable().defaultTo(false)
    table.boolean('posts_delete').notNullable().defaultTo(false)

    table.boolean('users_create').notNullable().defaultTo(false)
    table.boolean('users_read').notNullable().defaultTo(false)
    table.boolean('users_update').notNullable().defaultTo(false)
    table.boolean('users_delete').notNullable().defaultTo(false)

    table.boolean('roles_create').notNullable().defaultTo(false)
    table.boolean('roles_read').notNullable().defaultTo(false)
    table.boolean('roles_update').notNullable().defaultTo(false)
    table.boolean('roles_delete').notNullable().defaultTo(false)

    table.timestamp('createdAt')
    table.timestamp('updatedAt')
  }).then(() => ( // insert the system role
    knex('roles').insert({
      id: 0,
      name: 'SYSTEM',
      // if we're testing, set the date to a constant
      createdAt: (NODE_ENV === 'test' ? new Date(0) : new Date()).toISOString(),
    })
  ))
)

exports.down = (knex) => (
  knex.schema.dropTable('roles')
)
