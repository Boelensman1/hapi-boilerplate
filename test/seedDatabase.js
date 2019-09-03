const fs = require('fs')
const yaml = require('js-yaml')

/**
 * Insert a list of models
 *
 * @param {object} model The objection.js model to insert data for
 * @param {array} dataList The list of data to insert
 * @param {number} insertCount Which index of the array to insert
 * @param {array} inserted The list with the inserted instances
 * @returns {Promise} Promise that resolves when done
 */
function insert(model, dataList, insertCount, inserted) {
  if (!inserted) {
    inserted = []
  }

  if (!dataList[insertCount]) {
    // we're done!
    return Promise.resolve(inserted)
  }

  // objection.js does not support batch for all database engines
  // so we have to do this sequentially as well
  return model
    .query()
    .insert(dataList[insertCount])
    .then((i) => {
      inserted.push(i)
      return insert(model, dataList, insertCount + 1, inserted)
    })
}

/**
 * Insert a batch, grouped by model
 *
 * @param {array} models The objection.js models organized in an array
 * @param {array} dataLists Array of the data to insert
 * @param {array} names Array containing the names of the models
 * @param {number} batchCount Which batch to execute
 * @param {object} inserted For every key contains the inserted instances for
 *                          that key (every key is a model name)
 * @returns {Promise} Promise that resolves when done
 */
function insertBatch(models, dataLists, names, batchCount, inserted) {
  if (!inserted) {
    inserted = {}
  }

  if (!dataLists[batchCount]) {
    // we're done!
    return Promise.resolve(inserted)
  }

  // sequentially insert the batches
  return insert(models[batchCount], dataLists[batchCount], 0).then((result) => {
    const name = names[batchCount]
    inserted[name] = result
    return insertBatch(models, dataLists, names, batchCount + 1, inserted)
  })
}

/**
 * Seed the database from a yaml file
 *
 * @param {object} models The objection.js models
 * @param {string} seedfile The (absolute) location of the yaml file
 * @returns {Promise} Promise that resolves when done
 */
async function seedDatabase(models, seedfile) {
  if (seedfile === undefined) {
    return Promise.resolve()
  }
  const seed = yaml.safeLoad(fs.readFileSync(seedfile))

  const batchModels = Object.keys(seed).map((modelName) => {
    if (!models[modelName]) {
      throw new Error(`Unknown model ${modelName}`)
    }
    return models[modelName]
  })

  const batchData = Object.keys(seed).map((modelName) => seed[modelName])
  const names = Object.keys(seed)
  const result = await insertBatch(batchModels, batchData, names, 0)

  return result
}

module.exports = seedDatabase
