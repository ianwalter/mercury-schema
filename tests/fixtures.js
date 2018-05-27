exports.userSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string', minLength: 2, maxLength: 255 },
    email: { type: 'string', minLength: 5, maxLength: 255 },
    emailVerified: { type: 'boolean', default: false },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' }
  },
  required: ['name', 'email']
}

exports.user = {
  id: 1,
  name: 'Test User',
  email: 'user@test.io',
  emailVerified: true,
  password: 'Ou812',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
