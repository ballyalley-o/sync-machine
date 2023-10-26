const fs = require('fs')
const dotenv = require('dotenv')
const express = require('express')
require('colors')
const PATH = require('../constants/path.js')
const appState = require('../controllers/app-state.js')
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
        logger.log(`SERVER PORT: ${PORT}`.yellow)
        console.log('SERVER STATUS: connected'.yellow)
      })
    } catch (error) {
      console.log(error)
    }
  }
}


module.exports = App