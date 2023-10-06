require('colors')

const logger = {
  custom: (message, color, optional) =>
    console.log(message[color], optional || null),
  info: (message, optional) =>
    console.log(message.bgBlue, optional.bgYellow || null),
  error: (message, optional) => console.log(message.bgRed, optional || null),
  log: (message, optional) => console.log(message.yellow, optional || null),
  warn: (message, optional) => console.log(message.bgYellow, optional || null),
}

module.exports = logger