const fastJson = require('fast-json-stringify')

module.exports = function mercurySchema (schema) {
  const { response } = schema
  if (response) {
    Object.keys(response).forEach(k => (response[k] = fastJson(response[k])))
  }

  return function middleware (req, res, next) {
    if (response) {
      res.stringify = response
    }
    next()
  }
}
