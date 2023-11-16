const appStateRouter = require('./app-state.js')
const iniRouter = require('./ini.js')
const logRouter = require('./log.js')
const profileRouter = require('./profile.js')
// @globals
const PATH = require('../constants/path.js')

const appStateRoutes = appStateRouter
const logRoutes = logRouter
const iniRoutes = iniRouter
const profileRoutes = profileRouter


const mainRoute = (app) => {
  app.use(PATH.app_state, appStateRoutes)
  app.use(PATH.log, logRoutes)
  app.use(PATH.ini, iniRoutes)
  app.use(PATH.profile, profileRoutes)
}

module.exports = mainRoute