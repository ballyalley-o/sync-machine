require('colors')

const logger = {
  custom: (message, color, optional) =>
    console.log(message[color], optional || null),
  info: (message) =>
    console.log(message.bgBlue),
  error: (message, optional) => console.log(message.bgRed, optional || null),
  log: (message) => console.log(message.yellow),
  warn: (message, optional) => console.log(message.bgYellow, optional || null),
}

module.exports = logger