const appStateRouter = require('./app-state.js')
const iniRouter = require('./ini.js')
const logRouter = require('./log.js')
// @globals
const {PATH} = require('../constants')

const appStateRoutes = appStateRouter
const logRoutes = logRouter
const iniRoutes = iniRouter

const mainRoute = (app) => {
  app.use(PATH.app_state, appStateRoutes)
  app.use(PATH.log, logRoutes)
  app.use(PATH.ini, iniRoutes)
}

module.exports = mainRoute