const validate = (decoded, models, callback) => {
  const { uid } = decoded

  models.session.query().findById(uid).eager('user.role').then((session) => {
    if (!session || !session.valid) {
      return callback(false)
    }
    return callback(true, session)
  })
}

module.exports = validate
