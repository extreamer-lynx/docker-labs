'use strict'
const simple = require('./handlers/simple')
const configured = require('./handlers/configured')

module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  app.get('/', simple)

  app.get('/test', (_, res) => res.send("Server is working correctly"))

  app.get('/configured', configured(opts))
}
