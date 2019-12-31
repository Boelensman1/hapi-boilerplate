const Joi = require('@hapi/joi')
const Bourne = require('@hapi/bourne')

/* eslint-disable no-empty, consistent-return */
// see https://github.com/hapijs/joi/issues/2037
module.exports = Joi.extend({
  type: 'object',
  base: Joi.object(),
  coerce: {
    from: 'string',
    method(value) {
      if (value[0] !== '{' && !/^\s*\{/.test(value)) {
        return
      }

      try {
        return { value: Bourne.parse(value) }
      } catch (ignoreErr) {}
    },
  },
}).extend({
  type: 'array',
  base: Joi.array(),
  coerce: {
    from: 'string',
    method(value) {
      if (
        typeof value !== 'string' ||
        (value[0] !== '[' && !/^\s*\[/.test(value))
      ) {
        return
      }

      try {
        return { value: Bourne.parse(value) }
      } catch (ignoreErr) {}
    },
  },
})
