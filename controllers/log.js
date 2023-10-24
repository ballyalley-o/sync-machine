const fs = require('fs')
const { logger, coilLooper } = require('../middleware')
const { paths, logLive } = require('../utils')
const { global } = require('../constants')

const USERPROFILE = global.userProfile

let coilSpecs;
let jsonData

// @desc full Coil log
// @path /api/v1/log/coil
// @access Public [not implemented]
const coilLog = async (req, res ) => {
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
// @path /api/v1/log/parsedCoilLog
// @access Public [not implemented]
const parsedCoilLog = async (req, res) => {
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
        const revLines = lines.reverse()

        const coilBatchName = coilLooper(revLines, 'coilBatch')
        const coilLength = coilLooper(revLines, 'length')
        const coilThickness = coilLooper(revLines, 'thickness')
        let coilWidth = coilLooper(revLines, 'width')

        console.log(coilThickness, 'THICKNESS')

        coilWidth === 0 && (coilWidth = 'no width is provided')

        coilSpecs = {
          coilBatchName,
          coilLength,
          coilThickness,
          coilWidth,
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