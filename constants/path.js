const {GLOBAL} = require('../config')

const apiRoot = GLOBAL.apiRoot

const pathParams = {
  home: '/',
  app_state: '/app-state',
  analog:'/analog',
  log: '/log',
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
}



module.exports = PATH
