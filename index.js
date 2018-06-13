const fastJson = require('fast-json-stringify')
const Ajv = require('ajv')
const { InvalidStringifyParameterError } = require('./errors')

const ajv = new Ajv()
const $async = true

function mercurySchema (schema) {
  let stringify
  if (schema.response) {
    // Compile the response schema(s) ahead of time so handlers can generate a
    // response body quickly.
    if (schema.response.type) {
      // Set stringify using response as the schema.
      stringify = fastJson(schema.response)
    } else {
      // Set stringify using response as a map of schemas.
      stringify = {}
      const setStringify = k => (stringify[k] = fastJson(schema.response[k]))
      Object.keys(schema.response).forEach(setStringify)
    }
  }

  let validate = {}
  if (schema.request) {
    // Set async to true so that all of the validators can run in parallel.
    const $asnyc = true

    // Set the validator functions to the validate map by compiling the schemas.
    if (schema.request.type) {
      // If schema.request has a type then it should be used as the body schema.
      validate.body = ajv.compile({ $async, ...schema.request })
    } else {
      if (schema.request.body) {
        validate.body = ajv.compile({ $async, ...schema.request.body })
      }
      if (schema.request.params) {
        validate.params = ajv.compile({ $async, ...schema.request.params })
      }
      if (schema.request.query) {
        validate.query = ajv.compile({ $async, ...schema.request.query })
      }
      if (schema.request.headers) {
        validate.headers = ajv.compile({ $async, ...schema.request.headers })
      }
    }
  }

  const isStringifyMap = stringify && typeof stringify === 'object'

  return async function mercurySchemaMiddleware (req, res, next) {
    if (schema.request) {
      req.valid = true
      try {
        // Conditionally validate each request object in parallel.
        await Promise.all([
          ...(validate.body ? [validate.body(req.body)] : []),
          ...(validate.params ? [validate.params(req.params)] : []),
          ...(validate.query ? [validate.query(req.query)] : []),
          ...(validate.headers ? [validate.headers(req.headers)] : [])
        ])
      } catch (err) {
        // Store validation result and errors in the request so it can be used
        // by next middleware or by a request handler.
        req.valid = false
        req.validation = err
      }
    }

    if (schema.response) {
      // Add the response map to the response object so it can be used in the
      // request handlers, e.g. res.stringify[200](payload).
      res.stringify = function (key, data) {
        let typeOfKey = typeof key
        if (typeOfKey === 'object' && !isStringifyMap) {
          // The key is actually data and stringify is a function that will
          // turn it into a JSON string.
          return stringify(key)
        } else if (typeOfKey === 'string' && isStringifyMap) {
          // The key is a reference to a function in the stringify map that will
          // turn data into a JSON string.
          return stringify[key](data)
        } else {
          // Continue with an error since there is obviously a usage error.
          return new InvalidStringifyParameterError(typeOfKey, isStringifyMap)
        }
      }
    }

    // Pony up!
    next()
  }
}

const validationSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    validation: { type: 'boolean' },
    errors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          keyword: { type: 'string' },
          dataPath: { type: 'string' },
          schemaPath: { type: 'string' },
          params: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              missingProperty: { type: 'string' }
            }
          },
          message: { type: 'string' }
        }
      }
    }
  }
}

module.exports = {
  mercurySchema,
  validationSchema,
  ValidationError: Ajv.ValidationError
}
