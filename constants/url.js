const PATH = require('./path')
const GLOBAL = require('../config/global.js')

const API = GLOBAL.api

const absPath = (...params) => {
  return API + params.join('/')
}

const LOG = {
  coil: 'coil',
  coil_parsed: 'parsed-coil-log',
}

const APPSTATE ={
  extract: 'extract',
  latest: 'latest',
  win: 'win',
  analog: 'analog',
  frames: 'frames'
}

const URL = {
  log: {
    coil: absPath(PATH.log, LOG.coil),
    coil_parsed: absPath(PATH.log, LOG.coil_parsed)
  },
  app_state: {
    this: absPath(PATH.app_state),
    extract: absPath(PATH.app_state, APPSTATE.extract),
    latest: absPath(PATH.app_state, APPSTATE.latest),
    win: absPath(PATH.app_state, APPSTATE.win),
    analog: absPath(PATH.app_state, APPSTATE.analog),
    frames: absPath(PATH.app_state, APPSTATE.frames)
  },
}

module.exports = URL