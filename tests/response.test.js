const { mercurySchema } = require('../')
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
