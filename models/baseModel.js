/* eslint-disable max-classes-per-file */

const { Model, Validator } = require('objection')
const Joi = require('@hapi/joi')
const { pick } = require('lodash')

const { toTime, toDate, isManyRelation } = require('../util')

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
      allowUnknown: model.constructor.allowUnknown,
    })
  }
}

const addNullAsEmptyAndSetDefault = (
  schema,
  { idColumn, virtualAttributes, relationProperties },
) => {
  if (!schema) {
    return schema
  }

  if (!relationProperties) {
    relationProperties = []
  }

  const modify = (key) => (schemaEntry) => {
    let result = schemaEntry.empty(null)

    // ignore id column, createdAt & updatedAt as these should
    // not default to null, because otherwise you can't insert them
    // same is true for the relation & virtual properties
    if (
      key !== idColumn &&
      key !== 'createdAt' &&
      key !== 'updatedAt' &&
      !relationProperties.includes(key) &&
      !virtualAttributes.includes(key)
    ) {
      if (result.describe().flags.default === undefined) {
        result = result.default(null)
      }
    }
    return result
  }

  Object.keys(schema).forEach((key) => {
    if (!schema[key]) {
      throw Error(`Key ${key} is not defined!`)
    }
    if (Array.isArray(schema[key])) {
      // scheme is in the form of [Joi.number(), Joi.string()]
      schema[key] = schema[key].map(modify(key))
    } else if (schema[key].empty) {
      // if this property can be empty, allow null as empty
      schema[key] = modify(key)(schema[key])
    }
  })
  return schema
}

const addVirtualAttributes = (model) => {
  const { relationMappings, baseSchema } = model

  if (!relationMappings) {
    return
  }
  if (!model.addedProperties) {
    model.addedProperties = []
  }
  if (!model.relationProperties) {
    model.relationProperties = []
  }

  const pushIfNotExists = (array, value) => {
    // check if the model includes this property (making it non virtual)
    // for example if the relation is from xxx.id to yyy.xxxId
    // then xxxId should not be virtual on the model yyy
    // we also check if we have not already added this property
    if (!Object.keys(baseSchema).includes(value) && !array.includes(value)) {
      array.push(value)
    }
  }

  Object.entries(relationMappings).forEach(([name, relation]) => {
    pushIfNotExists(model.relationProperties, name)
    if (isManyRelation(relation)) {
      pushIfNotExists(model.addedProperties, `${name}Ids`)
    } else {
      pushIfNotExists(model.addedProperties, `${name}Id`)
    }
  })
}

const addRelations = (model, type, addFullRelations) => {
  const { relationMappings } = model
  const schema = model[type]

  if (!relationMappings) {
    return schema
  }

  Object.entries(relationMappings).forEach(([name, relation]) => {
    const relationClass = require(relation.modelClass)

    addVirtualAttributes(model)
    let relationSchema = addNullAsEmptyAndSetDefault(relationClass[type], model)

    if (isManyRelation(relation)) {
      relationSchema = Joi.array().items(relationSchema)
      schema[`${name}Ids`] = Joi.array().items(Joi.number().min(0))
    } else {
      // id should NOT be required as $relatedQuery does not set the id
      // if you want to set a Id column as required,
      // do that validation in the beforeInsert & beforeUpdate hook
      schema[`${name}Id`] = Joi.number().min(0)
    }
    if (addFullRelations) {
      // allow null as empty
      schema[name] = Joi.compile(relationSchema).empty(null)
    }
  })
  return schema
}

// Override the `createValidator` method of a `Model` to use the
// custom validator.
class BaseModel extends Model {
  static addedProperties = []

  static get responseValidation() {
    // cache the result so we don't get into an endless loop
    if (!this.responseSchema) {
      addVirtualAttributes(this)
      this.responseSchema = addNullAsEmptyAndSetDefault(
        addRelations(this, 'baseResponseSchema', true),
        this,
      )
    }
    return this.responseSchema
  }

  static get payloadValidation() {
    if (!this.payloadSchema) {
      addVirtualAttributes(this)
      this.payloadSchema = addNullAsEmptyAndSetDefault(
        addRelations(this, 'basePayloadSchema', false),
        this,
      )
    }
    return this.payloadSchema
  }

  static get schema() {
    // cache the result
    if (!this.schemaWithRelations) {
      addVirtualAttributes(this)
      this.schemaWithRelations = addNullAsEmptyAndSetDefault(
        addRelations(this, 'baseSchema', true),
        this,
      )
    }
    return this.schemaWithRelations
  }

  static get idColumns() {
    const idColumns = []
    Object.entries(this.relationMappings).forEach(([name, relation]) => {
      if (isManyRelation(relation)) {
        idColumns.push({
          key: `${name}Ids`,
          name,
          many: true,
          model: relation.modelClass,
        })
      } else {
        idColumns.push({
          key: `${name}Id`,
          name,
          many: false,
          model: relation.modelClass,
        })
      }
    })
    return idColumns
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

  toJSON(opts) {
    if (!opts || !opts.noAdded) {
      return super.toJSON(opts)
    }
    const { noAdded, ...options } = opts
    const json = super.toJSON(options)

    if (!this.constructor.addedProperties) {
      return json
    }

    this.constructor.addedProperties.forEach((prop) => {
      delete json[prop]
    })

    return json
  }

  $parseDatabaseJson(json) {
    json = super.$parseDatabaseJson(json)
    toDate(json, 'createdAt')
    toDate(json, 'updatedAt')
    return json
  }

  $formatDatabaseJson(json) {
    json = super.$formatDatabaseJson(json)
    toTime(json, 'createdAt')
    toTime(json, 'updatedAt')
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
