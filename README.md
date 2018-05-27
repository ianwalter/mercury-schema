# mercury-schema
> An Express/Connect-compatible middleware for validation and serialization
> using ajv and fast-json-stringify

[![npm page][npm-image]][npm-url]
[![appjumpstart chat][gitter-image]][gitter-url]

## About



## Installation

```fish
❯ npm install @appjumpstart/mercury-schema --save
```

## Usage

**NOTE:** The example below assumes you're also using the
[mercury-send](https://github.com/appjumpstart/mercury-send) middleware to
stringify the response automatically when calling `res.send`.

Add `mercury-schema` as a route-level middleware before your route handler and
pass it a schema:

```js
const { mercurySchema } = require('@appjumpstart/mercury-schema')

// ...

app.post('/contact', [
  mercurySchema({
    request: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', minLength: 5 },
        message: { type: 'string' }
      },
      required: ['email', 'message']
    },
    response: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }),
  function contactHandler (req, res, next) {
    try {
      if (req.valid) {
        sendContactEmail(req.body)
        res.send({ message: 'Your message has been sent' })
        // Or if, for example, using express without using mercury-send:
        // const body = res.stringify({ message: 'Your message has been sent' })
        // res.type('json').end(body)
      } else {
        res.status(400).send(req.validationError)
      }
    } catch (err) {
      next(err)
    }
  }
])
```

## Acknowledgement

`mercury-schema` is completely modeled around the excellent validation and
serialization feature within the [Fastify](https://fastify.io) framework.

&nbsp;

<a href="https://github.com/appjumpstart">
  <img
    alt="AppJumpstart"
    src="https://appjumpstart.nyc3.digitaloceanspaces.com/assets/appjumpstart-transparent.jpg"
    height="50">
</a>

[npm-image]: https://img.shields.io/npm/v/@appjumpstart/mercury-schema.svg
[npm-url]: https://www.npmjs.com/package/@appjumpstart/mercury-schema
[gitter-image]: https://img.shields.io/gitter/room/appjumpstart/appjumpstart.svg
[gitter-url]: https://gitter.im/appjumpstart
