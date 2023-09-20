import readerRouter from './reader.js'

const apiRoot = process.env.API_ROOT

const readerRoutes = readerRouter
console.log(apiRoot, 'API')

export const mainRoute = (app) => {
  app.use(`/api/reader`, readerRoutes)
}
