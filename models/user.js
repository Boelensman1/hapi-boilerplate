const Joi = require('@hapi/joi')
const { omit } = require('lodash')
const zxcvbn = require('zxcvbn')
const argon2 = require('argon2')
const BaseModel = require('models/baseModel')

const { toTime, toDate } = require('../util')

class User extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return 'users'
  }

  static get virtualAttributes() {
    return ['password']
  }

  async setPassword() {
    if (zxcvbn(this.password).score < 3) {
      throw new Error('Password is too weak')
    }
    const hash = await argon2.hash(this.password, { type: argon2.argon2id })
    this.passwordHash = hash
    this.password = undefined
  }

  checkPassword(password) {
    return argon2.verify(this.passwordHash, password)
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext)
    return this.setPassword(queryContext)
  }

  $parseDatabaseJson(json) {
    json = super.$parseDatabaseJson(json)
    toDate(json, 'loggedInAt')
    return json
  }

  $formatDatabaseJson(json) {
    json = super.$formatDatabaseJson(json)
    toTime(json, 'loggedInAt')
    return json
  }

  $formatJson(json) {
    // Call the super class's implementation.
    json = super.$formatJson(json)
    return omit(json, ['passwordHash', 'password'])
  }

  getFiltered() {
    return omit(this.toJSON(), ['passwordHash', 'password'])
  }

  static get baseSchema() {
    return {
      id: Joi.number()
        .min(0)
        .description('The id of the wanted object'),
      username: Joi.string()
        .min(3)
        .max(255)
        .required()
        .description('The username that the user can use to login'),
      passwordHash: Joi.string()
        .min(3)
        .max(255)
        .description('The hash of the user'),
      password: Joi.string()
        .min(3)
        .max(255)
        .description('The password of the user'),
      roleId: Joi.number()
        .min(0)
        .description('The id of the role of the user'),
      loggedInAt: Joi.date().description('When the user last logged in'),
      createdAt: Joi.date().description('When the object was created'),
      updatedAt: Joi.date().description('When the object was last updated'),
    }
  }

  // used by hapi to validate the response, see the handler
  static get baseResponseSchema() {
    return {
      id: User.baseSchema.id.required(),
      username: User.baseSchema.username.required(),
      roleId: User.baseSchema.roleId.required(),
      loggedInAt: User.baseSchema.loggedInAt,
      createdAt: User.baseSchema.createdAt.required(),
      updatedAt: User.baseSchema.updatedAt,
    }
  }

  // used by hapi to validate the payload, see the handler
  static get basePayloadSchema() {
    return {}
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
      session: {
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
