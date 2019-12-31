const Joi = require('@hapi/joi')

const BaseModel = require('models/baseModel')

class Role extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return 'roles'
  }

  static get objects() {
    // also used by createAdminAcount
    return ['posts', 'users', 'roles']
  }

  static get baseSchema() {
    const base = Joi.boolean()
      .truthy('1', 1)
      .falsy('0', 0)
      .default(false)

    const permissionBlocks = Role.objects.reduce((perm, obj) => {
      perm[`${obj}_create`] = base.description(`Allow role to add a ${obj}`)
      perm[`${obj}_read`] = base.description(`Allow role to read a ${obj}`)
      perm[`${obj}_update`] = base.description(`Allow role to update a ${obj}`)
      perm[`${obj}_delete`] = base.description(`Allow role to delete a ${obj}`)
      return perm
    }, {})

    return {
      id: Joi.number()
        .min(0)
        .description('The id of the role object'),
      name: Joi.string()
        .min(3)
        .required()
        .description('Name of the role'),

      ...permissionBlocks,

      createdAt: Joi.date().description('When the object was created'),
      updatedAt: Joi.date().description('When the object was last updated'),
    }
  }

  // used by hapi to validate the response, see the handler
  static get baseResponseSchema() {
    const permissionBlocks = Role.objects.reduce((perm, obj) => {
      perm[`${obj}_create`] = Role.baseSchema[`${obj}_create`].required()
      perm[`${obj}_read`] = Role.baseSchema[`${obj}_read`].required()
      perm[`${obj}_update`] = Role.baseSchema[`${obj}_update`].required()
      perm[`${obj}_delete`] = Role.baseSchema[`${obj}_delete`].required()
      return perm
    }, {})
    return {
      id: Role.baseSchema.id.required(),
      name: Role.baseSchema.name.required(),

      ...permissionBlocks,

      createdAt: Role.baseSchema.createdAt.required(),
      updatedAt: Role.baseSchema.updatedAt,
    }
  }

  // used by hapi to validate the payload, see the handler
  static get basePayloadSchema() {
    return {}
  }

  static get relationMappings() {
    return {
      user: {
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
