const moment = require('moment-timezone')
const { USER, NODE, HOST } = require('./local.js')
const COUNTRY = require('../constants/country.js')
const dotenv = require('dotenv')
dotenv.config()

const dateNow = new Date()

const GLOBAL = {
  userProfile: USER,
  node: NODE,
  host: HOST,
  api: process.env.API_LOCAL,
  apiRoot: process.env.API_ROOT,
  port: process.env.API_PORT,
  ip_socket: process.env.IP_SOCKET,
  time: {
    UTC: dateNow.toUTCString(),
    ISO: dateNow.toISOString(),
    TIME: dateNow.toTimeString(),
    DATE: dateNow.toLocaleDateString(),
    custom: (city) => moment().tz(COUNTRY[city]).format(),
  },
}


module.exports = GLOBAL
