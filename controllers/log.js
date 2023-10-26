const fs = require('fs')
const fetch = require('node-fetch')
const { logger, coilLooper } = require('../middleware')
const { paths, logLive, nuller } = require('../utils')
const { GLOBAL } = require('../config')
const { URL } = require('../constants')

const USERPROFILE = GLOBAL.userProfile

const urlPath = URL.app_state.extract
console.log(urlPath)

let coilSpecs
let jsonData

// @desc full Coil log
// @path /api/v1/log/coil
// @access Public [not implemented]
const coilLog = async (req, res) => {
  const filePath = await paths.livePath('coil', 'txt').then((result) => {
    promisePath = result
    logger.log(promisePath)
    return promisePath
  })

  if (USERPROFILE) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      try {
        const lines = data.split('\n')

        for (const line of lines) {
          logger.log(line)
        }

        res.status(200).json(lines)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    })
  }
}

// @desc Totals for Coil log
// @path /api/v1/log/parsed-coil-log
// @access Public [not implemented]
const parsedCoilLog = async (req, res) => {
  const filePath = await paths.livePath('coil', 'txt').then((result) => {
    promisePath = result
    logger.log(promisePath)
    return promisePath
  })

  const coilState = await fetch(URL.app_state.extract, {
    method: 'GET',
  })
    const appStateFetch = await coilState.json()

  if (USERPROFILE) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      try {
        const lines = data.split('\n')
        const revLines = lines.reverse()

        // data from extract route
        const hmiVersion = appStateFetch.HMIVersion
        const coilCoating = appStateFetch.coilSpecs.coating
        const coilInnerDiameter = appStateFetch.coilSpecs.inner_diameter
        const coilOuterDiameter = appStateFetch.coilSpecs.outer_diameter
        const previousBatch = appStateFetch.coilSpecs.previous_batch
        const coilLengthAppState = appStateFetch.coilSpecs.length

        // log extract
        const coilBatchName = coilLooper(revLines, 'coilBatch')
        const coilLength = coilLooper(revLines, 'length')
        const coilThickness = coilLooper(revLines, 'thickness')
        let coilWidth = coilLooper(revLines, 'width')

        coilOuterDiameter === null && (coilOuterDiameter = 'coil outer diameter not provided')
        // coilWidth === 0 && (coilWidth = 'coil width is not provided')

        coilSpecs = {
          HMI_version: hmiVersion,
          batch: nuller(coilBatchName),
          length_log: coilLength,
          length_appstate:coilLengthAppState,
          inner_diameter: coilInnerDiameter,
          outer_diameter: coilOuterDiameter,
          thickness: coilThickness,
          width: coilWidth,
          coating: coilCoating,
          previous_batch: previousBatch,
        }

        res.status(200).json(coilSpecs)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    })
  }
}

// // @desc Totals for Coil log
// // @path /api/v1/log/coil
// // @access Public [not implemented]
// const coilWatcher = async (req, res ) => {
//     const filePath = await paths.livePath('coil', 'txt').then((result) => {
//     promisePath = result
//     logger.log(promisePath)
//     return promisePath
//     })

//   if (USERPROFILE) {
//     fs.readFile(filePath, 'utf8', (err, data) => {
//       if (err) {
//         res.status(500).json({ error: err })
//         return
//       }
//       try {
//         const lines = data.split('\n')

//         for (const line of lines) {
//           logger.log(line)
//         }

//         res.status(200).json(lines)
//       } catch (err) {
//         res.status(500).json({ error: err })
//       }
//     })
//   }
// }

const logController = { coilLog, parsedCoilLog }
module.exports = logController
