const appStateRouter = require('./app-state.js')
const analogRouter = require('./analog.js')
const logRouter = require('./log.js')
// @globals
const {PATH} = require('../constants')

const appStateRoutes = appStateRouter
const logRoutes = logRouter

const mainRoute = (app) => {
  app.use(PATH.app_state, appStateRoutes)
  app.use(PATH.log, logRoutes)
}

module.exports = mainRoute