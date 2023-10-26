const fs = require('fs')
const path = require('path')
const { logger, logLooper, analogLooper } = require('../middleware')
const { paths, logLive } = require('../utils')
const { GLOBAL } = require('../config')


const USERPROFILE = GLOBAL.userProfile
let totalSum
// @desc Reader for Production log
// @file appState.json
// @path /api/v1/app-state
// @access Public [not implemented]
const analog_reader = async (req, res) => {
  if (USERPROFILE) {
    fs.readFile(paths.dynamicRootPath('appState.json'), 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: err })
        return
      }
      try {
        const jsonData = JSON.parse(data)

        const hydraulicPressure = jsonData.config.Analogue_Display_0
        const airPressure = jsonData.config.Analogue_Display_1
        const decoilerArm = jsonData.config.Analogue_Display_2
        const oilTemp = jsonData.config.Analogue_Display_3
        const driveCurrent = jsonData.config.Analogue_Display_4
        const driveFrequency = jsonData.config.Analogue_Display_5

        const analogDisplay = {
            Hydraulic_Pressure: hydraulicPressure,
            Air_Pressure: airPressure,
            Decoiler_Arm: decoilerArm,
            Oil_Temp: oilTemp,
            Drive_Current: driveCurrent,
            Drive_Frequency: driveFrequency
        }

        res.json(analogDisplay)
      } catch (parseError) {
        logger.error('Error parsing JSON:', parseError)
        res.status(500).json({ error: parseError.message })
      }
    })
  }
}


const analogController = {
  analog_reader,
}
module.exports = analogController