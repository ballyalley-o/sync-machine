const fs = require('fs')
// const path = require('path')
// const chokidar = require('chokidar')
// const io = require('../app')
const { logger, iniLooper } = require('../middleware')
const { paths, compareActions } = require('../utils')
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
     fs.readFile(paths.iniPath, 'utf8', async (err, data) => {
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
          let burnInValue = await iniLooper.iniSimUpdate('burnIn', modifiedLine, line)
          modifiedLine = burnInValue

          // change target value param to 20 if not already
          let targetValue = iniLooper.iniSimUpdate(
            'targetWindow',
            modifiedLine,
            line
          )
          modifiedLine = targetValue

          // change time param to 300 if not already
          let timeValue = await iniLooper.iniSimUpdate(
            'time',
            modifiedLine,
            line
          )
          modifiedLine = timeValue

          // change time param to 300 if not already
          let ipValue = await iniLooper.iniSimUpdate(
            'address',
            modifiedLine,
            line
          )
          modifiedLine = ipValue

          //  change the values for proxes and solenoids to 0 if not already
          let zerosValue = await iniLooper.iniZeros(modifiedLine, line)
          modifiedLine = zerosValue

          modifiedIni.push(modifiedLine)
        }

          let modifiedData
          // Join the modified lines back into a single string
          if (data !== modifiedData) {
            modifiedData = modifiedIni.join('\n')
          }

        //compare purposes only: to avoid duplicating the data
        let prevLength = data.length
        let modLength = modifiedData.length


        // Write the modified data back to the file
        if (data !== modifiedData) {
          const changes = compareActions.compareArr(data, modifiedData)
          if (changes.length >= 1) {
             fs.writeFile(paths.iniPath, modifiedData, (writeErr) => {
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

// UNDER DEVELOPMENT ======================================================

// @desc compare ini
// @path /api/0.0.1/ini/compare
// @access Private - Dev [not implemented]
const iniCompare = async (req, res) => {
    if (USERPROFILE) {
      // using promisified callbacks from fs --not available for nodev9.11.1
      // const iniOne =  fs.readFile(paths.iniPath, 'utf8')
      // const iniTwo =  fs.readFile(paths.testFilesPath, 'utf8')
      fs.readFile(paths.iniPath, 'utf8', (err, iniOne) => {
        if (err) {
          logger.error(err)
          return res.status(500).json({ error: err.message})
        }
// TODO: use user input path instead of this dev path
        fs.readFile(paths.testFilesPath, 'utf8', (err, iniTwo) => {
          if (err) {
            logger.error(err)
            return res.status(500).json({ error: err.message})
          }

          const linesOne = iniOne.split('\n')
          const linesTwo = iniTwo.split('\n')

// TODO: compare by param names instead of lines, add a different method: if the param has multiple include the tool names/parent name
          const compare = compareActions.compareArrByProperty(
            linesOne,
            linesTwo
          )

          res.status(200).json({
            message: 'Changes',
            compare,
          })
        })
      })
    } else {
      res.status(401).json({ error: 'Unauthorized' })
    }
}


const iniController = { iniExtract, iniSimulation, iniCompare }
module.exports = iniController