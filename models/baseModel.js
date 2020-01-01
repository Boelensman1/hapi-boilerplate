/* eslint-disable max-classes-per-file */

const { Model, Validator } = require('objection')
const Joi = require('@hapi/joi')
const { pick } = require('lodash')

const { toDate } = require('../util')

const isHasManyRelation = (relation) =>
  relation.relation.name === 'HasManyRelation'

class JoiValidator extends Validator {
  // eslint-disable-next-line class-methods-use-this
  validate(args) {
    // model = The model instance. May be empty at this point.
    // json = The properties to validate. After validation these values will
    // be merged into `model` by objection.
    const { model, json } = args

    // args.options is the `ModelOptions` object.
    // We need to check the `opt.patch` boolean. If it is true
    // we are validating a patch object, the defaults should not be set.
    const isPatch = args.options.patch

    // Do your validation here and throw any exception if the
    // validation fails.
    let joiSchema = model.constructor.schema
    // if no schema has been defined, just return immediatly
    if (!joiSchema) {
      return json
    }

    if (isPatch) {
      // remove all values not present in the patch
      joiSchema = pick(joiSchema, Object.keys(json))
    }

    return Joi.attempt(json, Joi.compile(joiSchema), {
      noDefaults: isPatch,
    })
  }
}

const addNullAsEmpty = (schema) => {
  if (!schema) {
    return schema
  }
  Object.keys(schema).forEach((key) => {
    if (Array.isArray(schema[key])) {
      // scheme is in the form of [Joi.number(), Joi.string()]
      schema[key] = schema[key].map((s) => s.empty(null))
    } else if (schema[key].empty) {
      // if this property can be empty, allow null as empty
      schema[key] = schema[key].empty(null)
    }
  })
  return schema
}

const addRelations = (schema, relationMappings, type) => {
  if (!relationMappings) {
    return schema
  }
  Object.entries(relationMappings).forEach(([name, relation]) => {
    const relationClass = require(relation.modelClass)

    let relationSchema = addNullAsEmpty(relationClass[type])

    if (isHasManyRelation(relation)) {
      relationSchema = Joi.array().items(relationSchema)
    }
    // allow null as empty
    schema[name] = Joi.compile(relationSchema).empty(null)
  })
  return schema
}

// Override the `createValidator` method of a `Model` to use the
// custom validator.
class BaseModel extends Model {
  static get responseValidation() {
    // cache the result so we don't get into an endless loop
    if (!this.responseSchema) {
      this.responseSchema = addNullAsEmpty(
        addRelations(
          this.baseResponseSchema,
          this.relationMappings,
          'baseResponseSchema',
        ),
      )
    }
    return this.responseSchema
  }

  static get payloadValidation() {
    if (!this.payloadSchema) {
      this.payloadSchema = addNullAsEmpty(this.basePayloadSchema)
    }
    return this.payloadSchema
  }

  static get schema() {
    // cache the result
    if (!this.schemaWithRelations) {
      this.schemaWithRelations = addNullAsEmpty(
        addRelations(this.baseSchema, this.relationMappings, 'baseSchema'),
      )
    }
    return this.schemaWithRelations
  }

  static createValidator() {
    return new JoiValidator()
  }

  static get modifiers() {
    const { defaultAttributes } = this
    return {
      defaultAttributes(builder) {
        // if we have defaultAttributes, select them
        if (defaultAttributes) {
          builder.select(defaultAttributes)
        }
      },
    }
  }

  // format date's
  $parseDatabaseJson(json) {
    json = super.$parseDatabaseJson(json)
    toDate(json, 'createdAt')
    toDate(json, 'updatedAt')
    return json
  }

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }
}

module.exports = BaseModel
