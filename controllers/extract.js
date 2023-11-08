const fs = require('fs')
const { logger, extractBySection } = require('../middleware')
const { paths, compareActions } = require('../utils')
const { GLOBAL } = require('../config')
const { BURN_IN_PARAMS, RESPONSE } = require('../constants')

const USERPROFILE = GLOBAL.userProfile

// @desc compare ini
// @path /api/0.0.1/ini/compare
// @access Private - Dev [not implemented]
const extractSection = async (req, res) => {
  if (USERPROFILE) {
    // using promisified callbacks from fs --not available for nodev9.11.1
    // const iniOne =  fs.readFile(paths.iniPath, 'utf8')
    // const iniTwo =  fs.readFile(paths.testFilesPath, 'utf8')
    fs.readFile(paths.iniPath, 'utf8', (err, iniOne) => {
      if (err) {
        logger.error(err)
        return res.status(500).json({ error: err.message })
      }
      // TODO: use user input path instead of this dev path
        const linesOne = iniOne.split('\n')

        const extracted = extractBySection(linesOne, 'Profile_')

        // TODO: compare by param names instead of lines, add a different method: if the param has multiple include the tool names/parent name
        // const compare = compareActions.compareArrByProperty(linesOne, linesTwo)

        res.status(200).json({
            message: 'Extract Successful',
            extracted,
        })
    })
  } else {
    res.status(401).json({ error: 'Unauthorized' })
  }
}


const extractController = { extractSection }
module.exports = extractController