const { insertIdColumn } = require('../util')
const Role = require('models/role')

exports.up = (knex) =>
  knex.schema.createTable('roles', (table) => {
    insertIdColumn(table)
    table.string('name').notNullable().unique()

    Role.objects.forEach((obj) => {
      table.boolean(`${obj}_create`).notNullable().defaultTo(false)

      table.boolean(`${obj}_read`).notNullable().defaultTo(false)

      table.boolean(`${obj}_update`).notNullable().defaultTo(false)

      table.boolean(`${obj}_delete`).notNullable().defaultTo(false)
    })

    table.bigInteger('createdAt').notNullable()
    table.bigInteger('updatedAt')
  })

exports.down = (knex) => knex.schema.dropTable('roles')
