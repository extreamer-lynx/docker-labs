'use strict'
const express = require('express');
const auth = require('./handlers/auth')
const user = require('./handlers/user')
const task = require('./handlers/task')

module.exports = function (app) {
  app.use(express.json({extended: true}));
  app.use('/api/auth', auth)
  app.use('/api/user', user)
  app.use('/api/tasks', require('./middleware/auth'), task)
}
