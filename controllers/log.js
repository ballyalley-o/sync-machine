const fs = require('fs')
const fetch = require('node-fetch')
const WebSocket = require('ws')
const {
  logger,
  coilLooper,
  sysLooper,
  productionLooper,
  erpLooper,
} = require('../middleware')
const { paths, nuller } = require('../utils')
const { GLOBAL } = require('../config')
const { URL, RESPONSE, LOG } = require('../constants')
// models
const { Production, ERP } = require('../models')

const USERPROFILE = GLOBAL.userProfile

let coilSpecs

// @desc  Coil log file
// @path /api/v1/log/coil
// @access Public [not implemented]
const coilLog = async (req, res) => {
  let promisePath

  if (USERPROFILE) {
    await paths.latestLogPath('coil', 'txt').then((result) => {
      promisePath = result
      logger.log(promisePath)
      return promisePath
    })

    fs.readFile(promisePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      try {
        const lines = data.split('\n')

        res.status(200).json(lines)
      } catch (err) {
        logger.error(RESPONSE.error.parseErr(err.message))

        res.status(500).json({ error: err.message })
      }
    })
  } else {
    logger.error(RESPONSE.error.userProfile404(USERPROFILE))
    res.status(404).json({ error: error.message })
  }
}

// @desc Totals for Coil log
// @path /api/v1/log/parsed-coil-log
// @access Public [not implemented]
const parsedCoilLog = async (req, res) => {
  const filePath = await paths.latestLogPath('coil', 'txt').then((result) => {
    promisePath = result
    logger.log(promisePath)
    return promisePath
  })

  const coilLog = await fetch(URL.app_state.custom, {
    method: 'GET',
  })
  const appStateFetch = await coilLog.json()

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
        const previousBatch = appStateFetch.coilSpecs.previous_batch
        const coilLengthAppState = appStateFetch.coilSpecs.length
        let coilOuterDiameter = appStateFetch.coilSpecs.outer_diameter

        // log extract
        const coilBatchName = coilLooper(revLines, 'coilBatch')
        const coilLength = coilLooper(revLines, 'length')
        const coilThickness = coilLooper(revLines, 'thickness')
        let coilWidth = coilLooper(revLines, 'width')

        coilOuterDiameter === null &&
          (coilOuterDiameter = 'coil outer diameter not provided')
        // coilWidth === 0 && (coilWidth = 'coil width is not provided')

        coilSpecs = {
          HMI_version: hmiVersion,
          batch: nuller(coilBatchName),
          length_log: coilLength,
          length_appstate: coilLengthAppState,
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

// @desc Live Data Logging
// @path /api/v1/log/sys
// @access Public [not implemented]
const sysLog = async (req, res) => {
  const filePath = await paths.latestLogPath('sys', 'txt').then((result) => {
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
        const lines = data.split('\r\n').reverse()

        const dateLog = sysLooper(lines, 'date')
        const sysLog = sysLooper(lines, 'log')

        const nonEmptyLines = lines.filter((line) => line.trim() !== '')

        // FIXME: Data ouput of this, its not parsed
        res
          .status(200)
          .json({ date: dateLog, log: sysLog, data: nonEmptyLines })
      } catch (err) {
        logger.error(RESPONSE.error.parseErr(err.message))
        res.status(500).json({ error: err.message })
      }
    })
  }
}

// @desc erp log file
// @path /api/v1/log/erp
// @access Public [not implemented]
const erpLog = async (req, res) => {
  try {
    if (USERPROFILE) {
      let promisePath

      await paths.latestLogPath('erp', 'txt').then((result) => {
        promisePath = result
        return promisePath
      })

      fs.readFile(promisePath, 'utf8', async (err, data) => {
        if (err) {
          res.status(500).json({ error: err.message })
          return
        }

        try {
          const lines = data.split('\n')
          logger.log(lines)
          const components = lines.length

          // TODO: save erp logs to database

          let result = {}

          for (const key in LOG.erp) {
            result[key] = Object.values(erpLooper(lines, key))[0]
          }

          const erpLogExists = await ERP.findOne({
            dateTime: result.dateTime,
          })

          if (erpLogExists) {
            logger.log(RESPONSE.exists('erp log'))
            res.status(200).json({ erpLog: result })
            return
          } else {
            const newErpLog = await ERP.create(result)
            logger.log(RESPONSE.dbSaved('erp log'))
          }

          res.status(201).json({ erpLog: result })
        } catch (err) {
          logger.error(RESPONSE.error.parseErr(err.message))
          res.status(500).json({ error: err.message })
        }
      })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// @desc production log file
// @path /api/v1/log/production
// @access Public [not implemented]
const productionLog = async (req, res) => {
  try {
    if (USERPROFILE) {
      let promisePath

      await paths.latestLogPath('prod', 'txt').then((result) => {
        promisePath = result
        return promisePath
      })

      fs.readFile(promisePath, 'utf8', async (err, data) => {
        if (err) {
          res.status(500).json({ error: err.message })
          return
        }

        try {
          const lines = data.split('\n')
          const components = lines.length

          let result = {}

          for (const key in LOG.production) {
            result[key] = Object.values(productionLooper(lines, key))[0]
          }

          const productionLogExists = await Production.findOne({
            dateTime: result.dateTime,
          })

          if (productionLogExists) {
            logger.log(RESPONSE.exists('production log'))
            res.status(200).json({ productionLog: result })
            return
          } else {
            const newProductionLog = await Production.create(result)
            logger.log(RESPONSE.dbSaved('production log'))
          }

          res.status(201).json({ productionLog: result })
        } catch (err) {
          logger.error(RESPONSE.error.parseErr(err.message))
          res.status(500).json({ error: err.message })
        }
      })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// const sysLogWs = async (req, res) => {
//   if (USERPROFILE) {
//     const filePath = await paths.latestLogPath('sys', 'txt')
//     logger.log(filePath)

//     // sets the appropriate headers for SSE
//     res.setHeader('Content-Type', 'text/event-stream')
//     res.setHeader('Cache-Control', 'no-cache')
//     res.setHeader('Connection', 'keep-alive')

//     const stream = fs.createReadStream(filePath, { encoding: 'utf8' })
//     stream.on('data', (data) => {
//       // split the log data and send it as a message to the client
//       const lines = data.split('\n').reverse()
//       const dateLog = sysLooper(lines, 'date')
//       const sysLog = sysLooper(lines, 'log')
//       const response = {
//         dateLog,
//         sysLog,
//         // revLines: lines,
//       }
//       res.write(`data: ${JSON.stringify(response)}\n\n`)
//     })
//     // Handle errors and end of the stream
//     stream.on('error', (error) => {
//       console.error(error)
//       res.status(500).json({ error: error.message })
//       res.end()
//     })

//     stream.on('end', () => {
//       res.end()
//     })
//   }
// }

// TODO: Under development!
// // @desc websockets live updates with the log
// // @path /api/v1/log/sys
// // @access Public [not implemented]
const sysLogWs = (server) => {
  const wws = new WebSocket.Server({ server })

  wws.on('connection', (ws) => {
    const filePath = paths.latestLogPath('sys', 'txt').then((result) => {
      promisePath = result
      logger.log(promisePath)
      return promisePath
    })

    const stream = fs.createReadStream(filePath, { encoding: 'utf8' })

    // read log and sends updates to websocket clients
    stream.on('data', (data) => {
      const lines = data.split('\n').reverse()
      const dateLog = sysLooper(lines, 'date')
      const sysLog = sysLooper(lines, 'log')

      console.log(data, 'data')
      const response = {
        dateLog,
        sysLog,
      }
      ws.on('message', (data) => {
        console.log(data, 'data!')
      })
    })

    stream.on('error', (error) => {
      logger.error(error)
    })

    ws.on('close', () => {
      // clean up after disconnecting websockets
      stream.destroy()
    })
  })
}

const logController = { coilLog, parsedCoilLog, sysLog, erpLog, productionLog }
module.exports = logController
