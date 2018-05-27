const { mercurySchema, ValidationError } = require('../')
const inject = require('light-my-request')

const { userSchema, user } = require('./fixtures')

test('request with valid payload passes validation', async () => {
  try {
    const handler = (req, res) => {
      req.body = JSON.parse(req._lightMyRequest.payload)
      mercurySchema({ request: userSchema })(req, res, () => {
        expect(req.valid).toBe(true)
        res.end()
      })
    }
    await inject(handler, { method: 'POST', url: '/', payload: user })
  } catch (err) {
    fail(err)
  }
})

test('request with missing required property fails validation', async () => {
  try {
    const handler = (req, res) => {
      req.body = JSON.parse(req._lightMyRequest.payload)
      mercurySchema({ request: userSchema })(req, res, () => {
        expect(req.valid).toBe(false)
        expect(req.validationError).toBeInstanceOf(Error)
        expect(req.validationError).toBeInstanceOf(ValidationError)
        const [error] = req.validationError.errors
        expect(error).toMatchSnapshot()
        res.end()
      })
    }
    const payload = { email: user.email }
    await inject(handler, { method: 'POST', url: '/', payload })
  } catch (err) {
    fail(err)
  }
})

test('request with invalid length fails validation', async () => {
  try {
    const handler = (req, res) => {
      req.body = JSON.parse(req._lightMyRequest.payload)
      mercurySchema({ request: userSchema })(req, res, () => {
        expect(req.valid).toBe(false)
        expect(req.validationError).toBeInstanceOf(Error)
        expect(req.validationError).toBeInstanceOf(ValidationError)
        expect(req.validationError.name).toBe('ValidationError')
        const [error] = req.validationError.errors
        expect(error).toMatchSnapshot()
        res.end()
      })
    }
    const payload = { ...user, email: 'c@v.' }
    await inject(handler, { method: 'POST', url: '/', payload })
  } catch (err) {
    fail(err)
  }
})
