const { lowerFirstLetter } = require('../../../util')

module.exports = (model, total, rangeStart, modelsFoundLength) => {
  const end = rangeStart + modelsFoundLength
  return `${lowerFirstLetter(model.name)} ${rangeStart}-${end}/${total}`
}
