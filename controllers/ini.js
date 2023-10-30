const fs = require('fs')
// const path = require('path')
// const chokidar = require('chokidar')
// const io = require('../app')
const { logger } = require('../middleware')
const { paths } = require('../utils')
const { GLOBAL } = require('../config')
const { BURN_IN_PARAMS, RESPONSE } = require('../constants')

const USERPROFILE = GLOBAL.userProfile

// @desc extract framesSet
// @path /api/0.0.1/ini
// @access Private - Dev [not implemented]
const iniExtract = async (req, res) => {
  if (USERPROFILE) {
    // await paths.rootPath('howick', 'ini').then((result) => {
    //   iniPath = result
    //   logger.log(`INI PATH: ${iniPath}`)
    //   return iniPath
    // })

    fs.readFile(paths.iniPath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: err.message })
      }
      try {
        const lines = data.split('\n')

        let iniLines = []

        for (const line of lines) {
             const equalSign = line.replace(/=/g, ':')
             iniLines.push(equalSign)
        }
        // parse ini to push to array

        res.status(200).json(iniLines)
      } catch (err) {
        logger.error(err)
        res.status(500).json({ error: err.message })
      }
    })
  }
}


// @desc prepare ini for Simulation
// @path /api/0.0.1/ini/sim
// @access Private - Dev [not implemented]
const iniSimulation = async (req, res) => {
  if (USERPROFILE) {
    fs.readFile(paths.testFilesPath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      try {
        let lines = data.split('\n')
        const modifiedLines = []

        const prevIni = []
        prevIni.push(lines)

        for (const line of lines) {
          let modifiedLine = line

          const isBurnIn = line.includes(BURN_IN_PARAMS.burnIn)
          if (isBurnIn) {
            const parts = line.split('=')
            if (parts.length === 2) {
              const boolValue = JSON.parse(parts[1].trim())

              // convert burnin to true
              if (boolValue == false) {
                parts[1] = 'true'
                modifiedLine = parts.join('=')
              }
            }
          }

          // change target window value to 20
          const targetWindow = line.match(BURN_IN_PARAMS.targetWindow)
          if (targetWindow) {
            const parts = line.split('=')
            if (parts.length === 2) {
              const targetWinValue = parseFloat(parts[1].trim())

              // convert burnin to true
              if (targetWinValue < 20) {
                parts[1] = 20
                modifiedLine = parts.join('=')
              }
            }
          }

          // change time param to 300 if not already
          const time = line.match(BURN_IN_PARAMS.time)
          if (time) {
            const parts = line.split('=')
            if (parts.length === 2) {
              const timeValue = parseFloat(parts[1].trim())

              // convert burnin to true
              if (timeValue < 300) {
                parts[1] = 300
                modifiedLine = parts.join('=')
              }
            }
          }

          //  change the values for proxes and solenoids
          for (const param of BURN_IN_PARAMS.zeros) {
            const PARAM = line.includes(param)

            if (PARAM) {
              // Split the line to separate the parameter name and its value
              const parts = line.split('=')
              if (parts.length === 2) {
                // Trim and check if it's a valid number
                const value = parseFloat(parts[1].trim())
                if (!isNaN(value) && value !== 0) {
                  // Change the value to 0
                  parts[1] = '0'
                  modifiedLine = parts.join('=')
                }
              }
            }
          }
          modifiedLines.push(modifiedLine)
        }
        // Join the modified lines back into a single string
        const modifiedData = modifiedLines.join('\n')
        // const parsedModData = JSON.stringify(modifiedData)
        // Write the modified data back to the file
        fs.writeFile(paths.testFilesPath, modifiedData, (writeErr) => {
          if (writeErr) {
            res.status(500).json({ error: writeErr.message })
          } else {
            res.status(201).json({
              message: RESPONSE.iniSimulation,
              params: modifiedData,
            })
          }
        })
      } catch (err) {
        logger.error(err)
        res.status(500).json({ error: err.message })
      }
    })
  }
}



const iniController = { iniExtract, iniSimulation }
module.exports = iniController