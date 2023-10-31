const { BURN_IN_PARAMS } = require('../../constants')

const iniBool = (param, modifiedLine, line) => {
  const isBool = line.includes(BURN_IN_PARAMS[param])
  let boolChanged = modifiedLine

  if (isBool) {
    const parts = line.split('=')
    if (parts.length === 2) {
      const boolValue = JSON.parse(parts[1].trim())
      // convert burnin to true
      if (boolValue == false) {
        parts[1] = 'true'
        boolChanged = parts.join('=')
        return boolChanged
      }
    }
  }
}

const iniLooper = { iniBool }
module.exports = iniLooper
