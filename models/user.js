const Joi = require('@hapi/joi')
const { omit } = require('lodash')
const zxcvbn = require('zxcvbn')
const argon2 = require('argon2')

const BaseModel = require('models/baseModel')
const Role = require('models/role')

class User extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return 'users'
  }

  static get virtualAttributes() {
    return ['password']
  }

  setPassword(queryContext) {
    if (zxcvbn(this.password).score < 3) {
      throw new Error('Password is too weak')
    }
    return argon2.hash(this.password, { type: argon2.argon2id })
      .then((hash) => {
        this.passwordHash = hash
        this.password = undefined
      })
  }

  checkPassword(password) {
    return argon2.verify(this.passwordHash, password)
  }

  $beforeInsert(queryContext) {
    this.createdAt = new Date().toISOString()

    return this.setPassword(queryContext)
  }

  getFiltered() {
    return omit(this.toJSON(), ['passwordHash', 'password'])
  }

  static get schema() {
    return {
      id: Joi.number().min(0).description('The id of the wanted object'),
      username: Joi.string().min(3).max(255).required()
        .description('The username that the user can use to login'),
      passwordHash: Joi.string().min(3).max(255)
        .description('The hash of the user'),
      password: Joi.string().min(3).max(255)
        .description('The password of the user'),
      roleId: Joi.number().min(0)
        .description('The id of the role of the user'),
      loggedInAt: Joi.date().description('When the user last logged in'),
      createdAt: Joi.date().description('When the object was created'),
      updatedAt: Joi.date().description('When the object was last updated'),
    }
  }

  // used by hapi to validate the response, see the handler
  static get responseValidation() {
    return BaseModel.compileSchema({
      id: User.schema.id.required(),
      username: User.schema.username.required(),
      roleId: User.schema.roleId.required(),
      role: Role.responseValidation,
      loggedInAt: User.schema.loggedInAt,
      createdAt: User.schema.createdAt.required(),
      updatedAt: User.schema.updatedAt,
    })
  }

  static get relationMappings() {
    return {
      role: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: `${__dirname}/role`,
        join: {
          from: 'users.roleId',
          to: 'roles.id',
        },
      },
      sessions: {
        relation: BaseModel.HasManyRelation,
        modelClass: `${__dirname}/session`,
        join: {
          from: 'users.id',
          to: 'sessions.userId',
        },
      },
    }
  }
}

module.exports = User
