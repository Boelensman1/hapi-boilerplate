const Joi = require('@hapi/joi')

const BaseModel = require('models/baseModel')

class Role extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return 'roles'
  }

  static get objects() {
    // used by createAdminAcount
    return ['posts', 'users', 'roles']
  }

  static get schema() {
    return {
      id: Joi.number().min(0).description('The id of the role object'),
      name: Joi.string().min(3).required().description('Name of the role'),

      posts_create: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to add a post'),
      posts_read: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to read the list of post'),
      posts_update: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to update the list of post'),
      posts_delete: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to remove a post'),

      users_create: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to add a user'),
      users_read: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to read the list of users'),
      users_update: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to update the list of users'),
      users_delete: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to remove a user'),

      roles_create: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to add a role'),
      roles_read: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to read the list of roles'),
      roles_update: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to update the list of roles'),
      roles_delete: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to remove a role'),

      createdAt: Joi.date().description('When the object was created'),
      updatedAt: Joi.date().description('When the object was last updated'),
    }
  }

  // used by hapi to validate the response, see the handler
  static get responseValidation() {
    return BaseModel.compileSchema({
      id: Role.schema.id.required(),
      name: Role.schema.name.required(),

      posts_create: Role.schema.posts_create.required(),
      posts_read: Role.schema.posts_read.required(),
      posts_update: Role.schema.posts_update.required(),
      posts_delete: Role.schema.posts_delete.required(),

      users_create: Role.schema.users_create.required(),
      users_read: Role.schema.users_read.required(),
      users_update: Role.schema.users_update.required(),
      users_delete: Role.schema.users_delete.required(),

      roles_create: Role.schema.roles_create.required(),
      roles_read: Role.schema.roles_read.required(),
      roles_update: Role.schema.roles_update.required(),
      roles_delete: Role.schema.roles_delete.required(),

      createdAt: Role.schema.createdAt.required(),
      updatedAt: Role.schema.updatedAt,
    })
  }

  static get relationMappings() {
    return {
      users: {
        relation: BaseModel.HasManyRelation,
        modelClass: `${__dirname}/user`,
        join: {
          from: 'roles.id',
          to: 'users.roleId',
        },
      },
    }
  }
}

module.exports = Role
