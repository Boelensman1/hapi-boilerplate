const toDate = (obj, fieldName) => {
  if (
    (obj != null && typeof obj[fieldName] === 'number') ||
    Number(obj[fieldName])
  ) {
    obj[fieldName] = new Date(Number(obj[fieldName]))
  }
  return obj
}

module.exports = toDate
