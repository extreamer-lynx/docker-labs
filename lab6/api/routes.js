'use strict'
const express = require('express');
const path = require('path')

const auth = require('./handlers/auth')
const user = require('./handlers/user')
const task = require('./handlers/task')

module.exports = function (app) {
  app.use(express.json({extended: true}));
  app.use('/api/auth', auth)
  app.use('/api/user', user)
  app.use('/api/tasks', require('./middleware/auth'), task)
  app.get('/heartbeat', (_, res) => res.send("OK. Enviroment is " + process.env.NODE_ENV))
  app.use('/storage', express.static(path.join(__dirname, 'static')))

  if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'))
    })
  }
}
