const {PATH} = require('./path')

const LOG = {
  erp: '/erpLatest',
  coil: '/coil',
  coil_parsed: '/parsed-coil-log',
}


const APPSTATE ={

}

const URL = {
  log: {
    erp: PATH.log + LOG.coil_parsed
  },
  app_state : {

  }
}

module.exports = URL