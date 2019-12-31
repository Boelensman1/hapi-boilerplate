/**
 * Make the first letter of a string lowercase
 *
 * @param {string} string The string to edit
 * @returns {string} The same string but with the first letter lowercase
 */
function lowerFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1)
}

module.exports = lowerFirstLetter
