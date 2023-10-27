const fs = require('fs')
// const path = require('path')
// const chokidar = require('chokidar')
// const io = require('../app')
const { logger } = require('../middleware')
const { paths } = require('../utils')
const { GLOBAL } = require('../config')

const USERPROFILE = GLOBAL.userProfile

// @desc extract framesSet
// @path /api/v1/app-state/frames
// @access Public [not implemented]
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


const iniController = {iniExtract}
module.exports = iniController