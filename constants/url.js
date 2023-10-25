const PATH = require('./path')
const {GLOBAL} = require('../config')

const LOG = {
  coil: '/coil',
  coil_parsed: '/parsed-coil-log',
}


const APPSTATE ={
  extract: '/extract'
}

const URL = {
  log: {
    erp: PATH.log + LOG.coil_parsed,
  },
  app_state: {
    extract: GLOBAL.api + PATH.app_state + APPSTATE.extract,
  },
}

module.exports = URL