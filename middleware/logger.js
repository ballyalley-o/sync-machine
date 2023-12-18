const { GLOBAL } = require('../config')

require('colors')

const logger = {
  custom: (message, color, optional) =>
    console.log(message[color], optional || null),
  info: (message) =>
    console.log(message.bgBlue),
  error: (message, error, optional) => {

    console.error(message.bgRed, optional || null)},
  log: (message) => console.log(message.yellow),
  warn: (message, optional) => console.log(message.bgYellow, optional || null),
  server: (port, isConnected) => {
      const nodev = GLOBAL.node
      const serv = {
        NODE_v: nodev,
        SERVER_PORT: port,
        SERVER_STATUS: isConnected ? ' CONNECTED' : 'NO CONNECTION',
      }
      if (nodev >= 10) {
          console.table(serv)
      } else {
        console.log('NODE v: '.bgYellow, serv.NODE_v.yellow )
        console.log('SERVER_PORT: '.bgYellow, serv.SERVER_PORT.yellow )
        console.log('SERVER_STATUS: '.bgYellow, serv.SERVER_STATUS.yellow)
      }

  },
  db: (host, dbName, isConnected) => {
    const DB_LOG =
      {
        HOST: host,
        DATABASE: dbName,
        STATUS: isConnected ? 'CONNECTED' : 'NO CONNECTION'
      }

      console.log('HOST: ', DB_LOG.HOST.yellow)
      console.log('DATABASE: ', DB_LOG.DATABASE.yellow)
      // isConnected ? console.log('STATUS: ', DB_LOG.STATUS.green) :  console.log('STATUS: ', DB_LOG.STATUS.red)

  }
}

module.exports = logger