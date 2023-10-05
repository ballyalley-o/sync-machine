const readerRouter = require('./reader.js')

const apiRoot = process.env.API_ROOT

const readerRoutes = readerRouter
console.log(apiRoot, 'API')

const mainRoute = (app) => {
  app.use(`/api/reader`, readerRoutes)
}

module.exports = mainRoute