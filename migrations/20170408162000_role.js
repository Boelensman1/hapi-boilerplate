const NODE_ENV = process.env.NODE_ENV || 'development'

const Role = require('models/role')

exports.up = (knex) =>
  knex.schema
    .createTable('roles', (table) => {
      table.increments()
      table
        .string('name')
        .notNullable()
        .unique()

      Role.objects.forEach((obj) => {
        table
          .boolean(`${obj}_create`)
          .notNullable()
          .defaultTo(false)

        table
          .boolean(`${obj}_read`)
          .notNullable()
          .defaultTo(false)

        table
          .boolean(`${obj}_update`)
          .notNullable()
          .defaultTo(false)

        table
          .boolean(`${obj}_delete`)
          .notNullable()
          .defaultTo(false)
      })

      table.timestamp('createdAt')
      table.timestamp('updatedAt')
    })
    .then(() =>
      // insert the system role
      knex('roles').insert({
        id: 0,
        name: 'SYSTEM',
        // if we're testing, set the date to a constant
        createdAt: (NODE_ENV === 'test'
          ? new Date(0)
          : new Date()
        ).toISOString(),
      }),
    )

exports.down = (knex) => knex.schema.dropTable('roles')
