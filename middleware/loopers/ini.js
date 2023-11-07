const { GLOBAL } = require('../../config')
const { BURN_IN_PARAMS } = require('../../constants')

/**
 *  Updates the parameters for simulation
 * @param {any} param
 * @param {obj} modifiedLine
 * @param {obj} line
 * @returns updated modifiedLine
 */
const iniSimUpdate = async (param, modifiedLine, line) => {
    let modLine = modifiedLine
  const paramValue = line.match(BURN_IN_PARAMS[param])

  if (paramValue) {
    const parts = line.split('=')
    if (parts.length === 2) {

      switch (param) {
        case 'burnIn':
          const boolValue = JSON.parse(parts[1].trim())
          // convert burnin to true
          if (boolValue == false) {
            parts[1] = 'true'
            modLine = parts.join('=')
          }
        break

        case 'targetWindow':
          const targetValue = parseFloat(parts[1].trim())
          if (targetValue < 20) {
            // update target window value to 20
            parts[1] = 20
            modLine = parts.join('=')
          }
        break

        case 'time':
          const timeValue = parseFloat(parts[1].trim())
          //change the time value to 300
          if (timeValue < 300) {
            parts[1] = 300
            modLine = parts.join('=')
          }
        break

        case 'address':
            const ipValue = parts[1].trim()
          // update the ip address to plc socket data .10
          if (ipValue !== GLOBAL.ip_socket) {
            parts[1] = GLOBAL.ip_socket
            modLine = parts.join('=')
          }
        break

        default:
            return null
      }

    }
  }
  return modLine
}

/**
 *  Loops through an array of parameters to update values to 0 for simulation
 * @param {obj} modifiedLine
 * @param {obj} line
 * @returns
 */
const iniZeros = async (modifiedLine, line) => {
    let paramChanged = modifiedLine
    for (const param of BURN_IN_PARAMS.zeros) {
        const isParam = await line.includes(param)

        if (isParam) {
            const parts = line.split('=')
            if (parts.length === 2) {
            const paramValue = parseFloat(parts[1].trim())
            // change the value of all params to 0
            if (!isNaN(paramValue) && paramValue !== 0) {
                parts[1] = 0
                paramChanged = parts.join('=')
            }
            }
        }
    }

    return paramChanged
}

const iniLooper = { iniSimUpdate, iniZeros }
module.exports = iniLooper
