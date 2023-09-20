import fs from 'fs'
import dotenv from 'dotenv'
import express from 'express'
import 'colors'
import PATH from '../constants/path.js'
import reader from '../controllers/reader.js'
import { mainRoute } from '../routes/index.js'
dotenv.config()

const PORT = 3000

export class App {
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
