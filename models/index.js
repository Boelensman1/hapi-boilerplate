// do not export baseModel
// this is useful as this way we can require models and get a list of all the
// models in the project
module.exports = require('util/exportAll')(__dirname, ['baseModel.js'])
