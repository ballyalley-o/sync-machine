const fs = require('fs')
const dotenv = require('dotenv')
const express = require('express')
require('colors')
const PATH = require('../constants/path.js')
const reader = require('../controllers/reader.js')
const mainRoute = require('../routes/index.js')
dotenv.config()

const PORT = 3000

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
        console.log(`SERVER PORT: ${PORT}`.yellow)
        console.log('SERVER STATUS: connected'.yellow)
      })
    } catch (error) {
      console.log(error)
    }
  }
}


module.exports = App