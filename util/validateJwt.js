/**
 * Validates a JSON web token using the database
 *
 * @param {object} decoded The decoded json webtoken
 * @param {object} models The models from the database
 * @param {function} callback Callback to call when done
 * @returns {undefined}
 */
async function validateJwt(decoded, models, callback) {
  const { uid } = decoded

  const session = await models.session
    .query()
    .findById(uid)
    .withGraphFetched('user.role')
  if (!session || !session.valid) {
    return callback(false)
  }
  return callback(true, session)
}

module.exports = validateJwt
