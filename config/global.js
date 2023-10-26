const {USER} = require('./user')
const dotenv = require('dotenv')
dotenv.config()

const GLOBAL = {
  userProfile: USER,
  api: process.env.API_LOCAL,
  apiRoot: process.env.API_ROOT,
  port: process.env.API_PORT,
}

module.exports = GLOBAL
