const Model = require('objection').Model
const Joi = require('joi')
const Validator = require('objection').Validator


class JoiValidator extends Validator {
  validate(args) { // eslint-disable-line class-methods-use-this
    // The model instance. May be empty at this point.
    const model = args.model

    // The properties to validate. After validation these values will
    // be merged into `model` by objection.
    const json = args.json


    // args.options is the `ModelOptions` object.
    // We need to check the `opt.patch` boolean. If it is true
    // we are validating a patch object, the defaults should not be set.
    const noDefaults = args.options.patch

    // Do your validation here and throw any exception if the
    // validation fails.
    const joiSchema = model.constructor.schema
    // if no schema has been defined, just return immediatly
    if (!joiSchema) { return json }
    const result = Joi.validate(json, joiSchema, { noDefaults })
    if (result.error) {
      throw result.error
    }

    return result.value
  }
}

// Override the `createValidator` method of a `Model` to use the
// custom validator.
class BaseModel extends Model {
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
