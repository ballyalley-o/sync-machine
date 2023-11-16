require('colors')
const fs = require('fs')
const dotenv = require('dotenv')
const express = require('express')
const http = require('http')
const mainRoute = require('../routes/index.js')
const logger = require('../middleware/logger.js')
const {sysLogWs} = require('../middleware')
const morgan = require('morgan')
const GLOBAL = require('./global.js')
dotenv.config()

const PORT = GLOBAL.port

/**
 * @param app - express app
 * @param express.json() - express body parser
 * @param express.urlencoded() - express url encoder
 * @param morgan() - morgan logger {short}
 * @param registerRoutes() - mount the routes/routing traffic
 * @param serfer - http server for web sockets
 */
class App {
  constructor() {
    this.app = express()
    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: true}))
    this.app.use(morgan('short'))
    this.registerRoutes()
    this.server = http.createServer(this.app)
    sysLogWs(this.server, PORT)
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