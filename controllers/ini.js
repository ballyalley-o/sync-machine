const fs = require('fs')
// const path = require('path')
// const chokidar = require('chokidar')
// const io = require('../app')
const { logger, iniLooper } = require('../middleware')
const { paths, compareArr } = require('../utils')
const { GLOBAL } = require('../config')
const { BURN_IN_PARAMS, RESPONSE } = require('../constants')

const USERPROFILE = GLOBAL.userProfile

// @desc extract framesSet
// @path /api/0.0.1/ini
// @access Private - Dev [not implemented]
const iniExtract = async (req, res) => {
  if (USERPROFILE) {

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

let prevIni = []
let modifiedIni = []

// @desc prepare ini for Simulation
// @path /api/0.0.1/ini/sim
// @access Private - Dev: Admin [not implemented]
const iniSimulation = async (req, res) => {
  if (USERPROFILE) {
    fs.readFile(paths.testFilesPath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      try {
        let lines = data.split('\n')
        prevIni.push(lines)

        for (const line of lines) {
          let modifiedLine = line

          // change burn in param to true if not already
          let burnInValue = iniLooper.iniSimUpdate('burnIn', modifiedLine, line)
          modifiedLine = burnInValue

          // change target value param to 20 if not already
          let targetValue = iniLooper.iniSimUpdate(
            'targetWindow',
            modifiedLine,
            line
          )
          modifiedLine = targetValue

          // change time param to 300 if not already
          let timeValue = iniLooper.iniSimUpdate('time', modifiedLine, line)
          modifiedLine = timeValue

          //  change the values for proxes and solenoids to 0 if not already
          let zerosValue = iniLooper.iniZeros(modifiedLine, line)
          modifiedLine = zerosValue

          modifiedIni.push(modifiedLine)
        }

          let modifiedData
          // Join the modified lines back into a single string
          if (data !== modifiedData) {
            modifiedData = modifiedIni.join('\n')
          }

        prevIniJoin = prevIni.join('\n')
        modIniJoin = modifiedIni.join('\n')

        //compare purposes only: to avoid duplicating the data
        let prevLength = data.length
        let modLength = modifiedData.length

        // const currDate = new Date()
        // const timestamp = currDate.toUTCString()

        // Write the modified data back to the file
        if (prevLength > modLength) {
          const changes = compareArr(data, modifiedData)

          fs.writeFile(paths.testFilesPath, modifiedData, (writeErr) => {
            if (writeErr) {
              res.status(500).json({ error: writeErr.message })
            } else {
              modifiedIni = []
              res.status(201).json({
                message: RESPONSE.iniSimulation,
                params: changes,
                timestamp: GLOBAL.time.custom('akl'),
              })
            }
          })
        } else {
          res.status(200).json({
            message: RESPONSE.noChanges,
            params: [],
            timestamp: GLOBAL.time.custom('akl'),
          })
        }
      } catch (err) {
        logger.error(err)
        res.status(500).json({ error: err.message })
      }
    })
  }
}

// TODO: ======================================================

// @desc compare ini
// @path /api/0.0.1/ini/compare
// @access Private - Dev [not implemented]
const iniCompare = async (req, res) => {
  let iniOne = []
  let iniTwo = []

  if (USERPROFILE) {
    fs.readFile(paths.iniPath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: err.message })
      }
      try {
        const lines = data.split('\n')
        // push arr one,
        return iniOne.push(lines)
      } catch (err) {
        logger.error(err)
      }
    })
  }

  fs.readFile(paths.testFilesPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: err.message })
    }
    try {
      const lines = data.split('\n')
      // push arr one,
      return iniTwo.push(lines)

    } catch (err) {
      logger.error(err)
      res.status(500).json({ error: err.message })
    }
  })

  const comparisons = compareArr(iniOne, iniTwo)

  res.status(200).json({
    message: 'CHANGES',
    comparisons: { iniOne: iniOne, iniTwo: iniTwo },
  })
}


const iniController = { iniExtract, iniSimulation, iniCompare }
module.exports = iniController