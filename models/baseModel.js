/* eslint-disable max-classes-per-file */

const { Model } = require('objection')
const Joi = require('@hapi/joi')
const { Validator } = require('objection')
const { pick } = require('lodash')


class JoiValidator extends Validator {
  validate(args) { // eslint-disable-line class-methods-use-this
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
    if (!joiSchema) { return json }

    if (isPatch) {
      // remove all values not present in the patch
      joiSchema = pick(joiSchema, Object.keys(json))
    }

    const result = Joi.validate(json, joiSchema, { noDefaults: isPatch })
    if (result.error) {
      throw result.error
    }

    return result.value
  }
}

// Override the `createValidator` method of a `Model` to use the
// custom validator.
class BaseModel extends Model {
  static compileSchema(schema) {
    Object.keys(schema).forEach((key) => {
      if (Array.isArray(schema[key])) {
        // scheme is in the form of [Joi.number(), Joi.string()]
        schema[key] = schema[key].map((s) => s.empty(null))
      } else {
        schema[key] = schema[key].empty(null)
      }
    })
    return Joi.compile(schema)
  }

  static createValidator() {
    return new JoiValidator()
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString()
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString()
  }
}

module.exports = BaseModel
