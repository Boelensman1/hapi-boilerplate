const toTime = (obj, fieldName) => {
  if (obj != null && obj[fieldName] != null) {
    if (obj[fieldName].getTime) {
      obj[fieldName] = obj[fieldName].getTime()
    } else {
      obj[fieldName] = new Date(obj[fieldName]).getTime()
    }
  }
  return obj
}

module.exports = toTime
