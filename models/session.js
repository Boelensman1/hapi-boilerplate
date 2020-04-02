const Joi = require('@hapi/joi')

const BaseModel = require('models/baseModel')
const User = require('models/user')

class Session extends BaseModel {
  static get tableName() {
    return 'sessions'
  }

  static get idColumn() {
    return 'uid'
  }

  // virtualAttributes must be defined, is used in crud route generation
  static get virtualAttributes() {
    return [...this.addedProperties]
  }

  static get baseSchema() {
    return {
      uid: Joi.string()
        .required()
        .description('The uid of the wanted object'),
      valid: Joi.boolean()
        .truthy(1, '1')
        .falsy(0, '0')
        .default(true)
        .description('Wether or not the token is still valid'),
      userId: Joi.number()
        .min(0)
        .description('The id of the connected user'),
      createdAt: Joi.date().description('When the object was created'),
      updatedAt: Joi.date().description('When the object was last updated'),
    }
  }

  // used by hapi to validate the payload, see the handler
  static get basePayloadSchema() {
    return {
      username: User.baseSchema.username.required(),
      password: User.baseSchema.password.required(),
    }
  }

  // used by hapi to validate the response, see the handler
  static get baseResponseSchema() {
    return {
      uid: Session.baseSchema.uid.required(),
      valid: Session.baseSchema.valid.required(),
      userId: Session.baseSchema.userId.required(),
      createdAt: Session.baseSchema.createdAt.required(),
      updatedAt: Session.baseSchema.updatedAt,
    }
  }

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: `${__dirname}/user`,
        join: {
          from: 'sessions.userId',
          to: 'users.id',
        },
      },
    }
  }
}

module.exports = Session
