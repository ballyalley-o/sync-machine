const fs = require('fs')
const fetch = require('node-fetch')
const WebSocket = require('ws')
const { logger, sysLooper } = require('../middleware')

const sysLogWs = (server, port) => {
  const wws = new WebSocket.Server({ server })

  wws.on('connection', async (ws) => {
    const filePath = paths.latestLogPath('sys', 'txt').then((result) => {
      promisePath = result
      logger.log(promisePath)
      return promisePath
    })

    const stream = fs.createReadStream(filePath, { encoding: 'utf8' })

    // read log and sends updates to websocket clients
    stream.on('message', (data) => {
      const lines = data.split('\n').reverse()
      const dateLog = sysLooper(lines, 'date')
      const sysLog = sysLooper(lines, 'log')

      const response = {
        dateLog,
        sysLog,
      }

      ws.send(JSON.stringify(response))
    })

    stream.on('error', (error) => {
      logger.error(error)
    })

    ws.on('close', () => {
      // clean up after disconnecting websockets
      stream.destroy()
    })
  })
}


module.exports = sysLogWs