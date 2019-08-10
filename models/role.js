const Joi = require('@hapi/joi')

const BaseModel = require('models/baseModel')

class Role extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return 'roles'
  }

  static get schema() {
    return {
      id: Joi.number().min(0).description('The id of the role object'),
      name: Joi.string().min(3).required().description('Name of the role'),

      post_read: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to read the list of post movies'),
      post_write: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to add a post movie'),
      post_delete: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to remove a post movie'),

      users_read: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to read the list of users'),
      users_write: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to add a user'),
      users_delete: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to remove a user'),

      roles_read: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to read the list of roles'),
      roles_write: Joi.boolean().truthy(1).falsy(0).default(false)
        .description('Allow this role to add a role'),
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

      post_read: Role.schema.post_read.required(),
      post_write: Role.schema.post_write.required(),
      post_delete: Role.schema.post_delete.required(),

      users_read: Role.schema.users_read.required(),
      users_write: Role.schema.users_write.required(),
      users_delete: Role.schema.users_delete.required(),

      roles_read: Role.schema.roles_read.required(),
      roles_write: Role.schema.roles_write.required(),
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
