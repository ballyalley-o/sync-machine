const readerRouter = require('./reader.js')
const analogRouter = require('./analog.js')
const logRouter = require('./log.js')

const apiRoot = process.env.API_ROOT

const readerRoutes = readerRouter
const analogRoutes = analogRouter
const logRoutes = logRouter


const mainRoute = (app) => {
  app.use(`/api/reader`, readerRoutes),
  app.use(`/api/analog`, analogRoutes)
  app.use(`/api/log`, logRoutes)
}

module.exports = mainRoute