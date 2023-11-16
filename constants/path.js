const GLOBAL = require('../config/global.js')
const COUNTRY = require('./country.js')

const apiRoot = GLOBAL.apiRoot

const pathParams = {
  home: '/',
  app_state: '/app-state',
  analog:'/analog',
  log: '/log',
  ini: '/ini',
  profile: '/profile'
}

const apiPath = (module) => {
  const dirPath = apiRoot + module
  return dirPath
}

const PATH = {
  home: '/',
  app_state: apiPath(pathParams.app_state),
  analog: apiPath(pathParams.analog),
  log: apiPath(pathParams.log),
  ini: apiPath(pathParams.ini),
  profile: apiPath(pathParams.profile),
}




module.exports = PATH
