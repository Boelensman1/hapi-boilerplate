const Joi = require('@hapi/joi')

const BaseModel = require('models/baseModel')
const User = require('models/user')

class Session extends BaseModel {
  // Table name is the only required property.
  static get tableName() {
    return 'sessions'
  }

  static get idColumn() {
    return 'uid'
  }

  static get schema() {
    return {
      uid: Joi.string()
        .required()
        .description('The uid of the wanted object'),
      valid: Joi.boolean()
        .truthy(1)
        .falsy(0)
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
  static get payloadValidation() {
    return BaseModel.compileSchema({
      username: User.schema.username.required(),
      password: User.schema.password.required(),
    })
  }

  // used by hapi to validate the response, see the handler
  static get responseValidation() {
    return BaseModel.compileSchema({
      uid: Session.schema.uid.required(),
      valid: Session.schema.valid.required(),
      userId: Session.schema.userId.required(),
      user: User.responseValidation,
      createdAt: Session.schema.createdAt.required(),
      updatedAt: Session.schema.updatedAt,
    })
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
