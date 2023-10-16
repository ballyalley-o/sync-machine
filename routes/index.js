const readerRouter = require('./reader.js')
const analogRouter = require('./analog.js')

const apiRoot = process.env.API_ROOT

const readerRoutes = readerRouter
const analogRoutes = analogRouter


const mainRoute = (app) => {
  app.use(`/api/reader`, readerRoutes),
  app.use(`/api/analog`, analogRoutes)
}

module.exports = mainRoute