const Boom = require('@hapi/boom')
const responseSchema = require('util/responseSchema')
const _ = require('lodash')
const Joi = require('../../util').JoiWithStringCoercion

const {
  parseRange,
  parseSort,
  parseFilter,
  getContentRange,
  getPagination,
  addSearch,
  formatResult,
} = require('./util')

module.exports = (modelName, { responseValidation }) => ({
  description: `Get list of ${modelName}`,
  tags: ['api', 'crud', modelName],
  validate: {
    query: Joi.object({
      sort: Joi.object({ field: Joi.string(), order: Joi.string() }),
      filter: Joi.object(),
      range: Joi.array()
        .length(2)
        .items(Joi.number().min(0)),
    }),
  },
  response: {
    schema: responseSchema(Joi.array().items(responseValidation)),
  },
  plugins: {
    hapiCrudAcl: {
      permissions: [`${modelName}:read`],
    },
  },
  async handler(request, h) {
    const { ioc } = request.server.app
    const model = ioc.resolve('models')[modelName]
    const { query } = request

    const { rangeStart, rangeEnd } = parseRange(query)

    // these will error if it's impossible to sort/filter by that column
    const sort = parseSort(query, model)
    const filter = parseFilter(query, model)
    const dbQuery = model
      .query()
      .modify('defaultAttributes')
      .skipUndefined()
      .where(filter.where)
      .range()

    // check if we're sorting by virtual
    if (!sort || !sort.virtual) {
      if (sort) {
        dbQuery.orderBy([sort])
      }
      // if we are we can't limit the dbQuery as we need all
      // results to know how to sort
      dbQuery.offset(rangeStart).limit(rangeEnd - rangeStart)
    }

    filter.whereIn.forEach((whereInFilter) => {
      dbQuery.whereIn(whereInFilter.column, whereInFilter.values)
    })
    filter.whereNotNull.forEach((whereNotNullFilter) => {
      dbQuery.whereNotNull(whereNotNullFilter)
    })

    // add seach
    if (filter.search) {
      if (!model.searchableAttributes) {
        throw Boom.badRequest(`${model.name} has no searchable columns`)
      }
      addSearch(dbQuery, model, filter)
    }

    const dbResult = await dbQuery
    let { results } = dbResult
    const { total } = dbResult

    if (sort && sort.virtual) {
      // manually sort & apply range to results
      // rangeStart and rangeEnd are always defined
      results = _.orderBy(results, [sort.column], [sort.order]).slice(
        rangeStart,
        rangeEnd,
      )
    }

    const contentRange = getContentRange(
      model,
      total,
      rangeStart,
      results.length,
    )
    const pagination = getPagination(model, total, query)

    return h
      .response({
        result: formatResult(results),
        pagination,
        statusCode: 200,
      })
      .header('Content-Range', contentRange)
  },
})
