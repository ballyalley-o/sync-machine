const App = require('./config/server.js')
const app = new App()
const io = require('socket.io')(app)

app.start()


module.exports = io
