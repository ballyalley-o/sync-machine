const PATH = require('./path')
const GLOBAL = require('../config/global.js')

const API = GLOBAL.api

const absPath = (...params) => {
  return API + params.join('/')
}

const INI = {
  toolDef: 'toolDef'
}

const LOG = {
  coil: 'coil',
  coil_parsed: 'parsed-coil-log',
  erp: 'erp'
}

const APPSTATE ={
  custom: 'custom',
  win: 'win',
  analog: 'analog',
  frames: 'frames'

}

const URL = {
  ini: {
    this: absPath(PATH.ini),
    section: (param) => absPath(PATH.ini, param)
  },
  log: {
    coil: absPath(PATH.log, LOG.coil),
    coil_parsed: absPath(PATH.log, LOG.coil_parsed),
    erp: absPath(PATH.log, LOG.erp)
  },
  app_state: {
    this: absPath(PATH.app_state),
    custom: absPath(PATH.app_state, APPSTATE.custom),
    win: absPath(PATH.app_state, APPSTATE.win),
    analog: absPath(PATH.app_state, APPSTATE.analog),
    frames: absPath(PATH.app_state, APPSTATE.frames),
  },
}


module.exports = URL