const Joi = require('@hapi/joi')

const responseSchema = (originalSchema) => {
  const payloadValidation = Joi.object().keys({
    statusCode: Joi.number()
      .min(100)
      .max(599),
    result: originalSchema,
    pagination: Joi.object({
      count: Joi.number().min(0),
      next: Joi.string(),
      previous: Joi.string(),
    }),
  })
  return payloadValidation
}

module.exports = responseSchema
