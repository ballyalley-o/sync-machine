require('colors')
const fs = require('fs')
const dotenv = require('dotenv')
const express = require('express')
const mainRoute = require('../routes/index.js')
const logger = require('../middleware/logger.js')
const GLOBAL = require('./global.js')
dotenv.config()

const PORT = GLOBAL.port

class App {
  constructor() {
    this.app = express()
    this.app.use(express.json())
    this.registerRoutes()
  }

  registerRoutes() {
    mainRoute(this.app)
  }

  start() {
    try {
      this.app.listen(PORT, () => {
        logger.server(PORT, true)
      })
    } catch (error) {
      logger.error(error.message)
      logger.server(PORT, false)
    }
  }
}


module.exports = App