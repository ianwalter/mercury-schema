const { mercurySchema, validationSchema } = require('../')
const inject = require('light-my-request')

const { userSchema, user } = require('./fixtures')

test('response with user schema', async () => {
  try {
    const handler = (req, res) => {
      mercurySchema({ response: userSchema })(req, res, () => {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(res.stringify(user))
      })
    }
    const response = await inject(handler, { url: '/' })
    const payload = JSON.parse(response.payload)
    expect(payload.id).toEqual(user.id)
    expect(payload.name).toEqual(user.name)
    expect(payload.password).toBeUndefined()
  } catch (err) {
    fail(err)
  }
})

test('response with ValidationError schema', async () => {
  try {
    const handler = (req, res) => {
      const schema = { request: userSchema, response: validationSchema }
      req.body = JSON.parse(req._lightMyRequest.payload)
      mercurySchema(schema)(req, res, () => {
        if (req.valid) {
          res.writeHead(200)
          res.end()
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(res.stringify(req.validation))
        }
      })
    }
    const opts = { method: 'POST', url: '/', payload: { email: user.email } }
    const response = await inject(handler, opts)
    const payload = JSON.parse(response.payload)
    expect(payload.errors[0].keyword).toEqual('required')
    expect(payload.errors[0].params.missingProperty).toEqual('name')
  } catch (err) {
    fail(err)
  }
})
