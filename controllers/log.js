const fs = require('fs')
const { logger, logLooper } = require('../middleware')
const { paths, logLive } = require('../utils')
const { global } = require('../constants')

const USERPROFILE = global.userProfile

let totalSum;

// @desc Totals for Coil log
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
        res.status(500).json({ error: err })
        return
      }
      try {
        const lines = data.split('\n')

        for (const line of lines) {
          logger.log(line)
        }

        res.status(200).json(lines)
      } catch (err) {
        res.status(500).json({ error: err })
      }
    })
  }
}


const logController = { coilLog }
module.exports = logController