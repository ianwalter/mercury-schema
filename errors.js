const BaseError = require('@ianwalter/base-error')

class InvalidStringifyParameterError extends BaseError {
  constructor (typeOfKey, isStringifyMap) {
    if (isStringifyMap) {
      super('Expected first parameter to be a string, got:', typeOfKey)
    } else {
      super('Expected first parameter to be a object, got:', typeOfKey)
    }
  }
}

module.exports = { InvalidStringifyParameterError }
