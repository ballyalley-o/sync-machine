const App = require('./config/server.js')
const app = new App()

app.start()
app.connectDb()


