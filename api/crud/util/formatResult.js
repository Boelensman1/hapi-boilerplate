const format = (obj) => {
  return obj.toJSON()
}

module.exports = (result) => {
  if (Array.isArray(result)) {
    return result.map((r) => format(r))
  }

  return format(result)
}
