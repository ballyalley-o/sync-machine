const fs = require('fs')
const { logger, iniLooper, extractBySectionObj } = require('../middleware')
const { paths, compareActions, normalize } = require('../utils')
const { GLOBAL } = require('../config')
const { TARGETS, RESPONSE } = require('../constants')

const USERPROFILE = GLOBAL.userProfile

// @desc ini ile
// @path /api/0.0.1/ini
// @access Private - Dev [not implemented]
const extractIni = async (req, res) => {
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
const simulationIni = async (req, res) => {
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

// @desc extract sections in ini
// @path /api/0.0.1/ini/custom
// @access Private - Dev [not implemented]
const customIni = async (req, res) => {
  if (USERPROFILE) {
    fs.readFile(paths.iniPath, 'utf8', (err, iniOne) => {
      if (err) {
        logger.error(err)
        return res.status(500).json({ error: err.message })
      }
      // TODO: use a prompt to enter extract value
        const linesOne = iniOne.split('\n')

        const EXTRACT_VALUE = '' // <- section to extract, default will extract all
        const configuration = extractBySectionObj(linesOne, EXTRACT_VALUE)

        res.status(200).json({
          message: RESPONSE.success[200],
          success: true,
          configuration
        })
    })
  } else {
    res.status(401).json({ error: RESPONSE.error[401] })
  }
}

// @desc sections in ini dynamically in the path param
// @path /api/0.0.1/ini/:section
// @access Private - Dev [not implemented]
const dynamicIni = async (req, res, next) => {
  const dynamicSection = await req.params.section
  let param
  let slicedNumber
  let lastUnderscoreIndex = dynamicSection.lastIndexOf('_')

  // handles dynamic concatinationbaltik09 of params with underscores
  if (lastUnderscoreIndex !== -1) {
      slicedNumber = dynamicSection.slice(lastUnderscoreIndex + 1)
      logger.info(slicedNumber)
    } else {
      logger.error(RESPONSE.error.underScoreIndex)
    }

  const normalizedDynamicSection = await normalize.normalizeParam(dynamicSection, TARGETS)
  const normalized = normalize.switchParam(param, normalizedDynamicSection, slicedNumber)

  if (dynamicSection) {
    if (USERPROFILE) {
      fs.readFile(paths.iniPath, 'utf8', (err, data) => {
        if (err) {
          logger.error(err)
          return res.status(500).json({ error: err.message })
        }
        const lines = data.split('\n')
        const section = extractBySectionObj(lines, String(normalized))

        res.status(200).json({
          message: RESPONSE.success[200],
          success: true,
          path: paths.iniPath,
          section
        })
      })
    } else {
      logger.error(RESPONSE.error.userProfile404(USERPROFILE))
      res.status(404).json({
        error: RESPONSE.error[404]
      })
    }
  } else {
    res.status(400)
    throw new Error(RESPONSE.error[400])
  }
}


// TODO: UNDER DEVELOPMENT ======================================================

// @desc compare ini
// @path /api/0.0.1/ini/compare
// @access Private - Dev [not implemented]
const compareIni = async (req, res) => {
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
            total: compare.length,
            compare,
          })
        })
      })
    } else {
      res.status(401).json({ error: 'Unauthorized' })
    }
}


const iniController = { extractIni, simulationIni, compareIni, customIni, dynamicIni }
module.exports = iniController