// const Mercury = require('mercury')
// const send = require('mercury-send')
// const schema = require('../')

// const userSchema = {
//   type: 'object',
//   properties: {
//     id: { type: 'integer' },
//     name: { type: 'string', minLength: 2, maxLength: 255 },
//     email: { type: 'string', minLength: 5, maxLength: 255 },
//     emailVerified: { type: 'boolean', default: false },
//     createdAt: { type: 'string' },
//     updatedAt: { type: 'string' }
//   }
// }

// const user = {
//   id: 1,
//   name: 'Test User',
//   email: 'user@test.io',
//   emailVerified: true,
//   password: 'Ou812',
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString()
// }

test('response with user schema', () => {
  // const app = new Mercury()
  // app.use(send)
  // const responseSchema = { response: { 200: userSchema } }
  // app.router.get('/', schema(responseSchema), (req, res) => res.send(user))
  // const response = await app.inject({ url: '/' })
  // const payload = JSON.parse(response.payload)
  // expect(payload.id).toEqual(user.id)
  // expect(payload.name).toEqual(user.name)
  // expect(payload.password).toBeUndefined()
})
