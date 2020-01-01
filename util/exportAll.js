// from https://gist.github.com/richmarr/1122217/578a2767ec126b9b9526b6ac6df7d9935ee190d8
const { readdirSync } = require('fs')
const { join } = require('path')

module.exports = (directory) =>
  // Read in the (js) files from a directory, require them and return them
  readdirSync(directory).reduce((accumulator, file) => {
    if (file.indexOf('.js') > -1 && file !== 'index.js')
      accumulator[file.replace('.js', '')] = require(join(directory, file))
    return accumulator
  }, {})
