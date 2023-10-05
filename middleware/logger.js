require('colors')

const logger = {
  custom: (message, color) => console.log(message[color]),
  info: (message) => console.log(message.bgBlue),
  error: (message) => console.log(message.bgRed),
  log: (message, optional) => console.log(message.yellow, optional || null),
}

module.exports = logger