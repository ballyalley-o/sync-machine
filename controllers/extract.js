const fs = require('fs')
const { logger, extractBySection } = require('../middleware')
const { paths, normalizeParam } = require('../utils')
const { GLOBAL } = require('../config')
const { TARGETS, RESPONSE } = require('../constants')

const USERPROFILE = GLOBAL.userProfile

// @desc extract sections in ini
// @path /api/0.0.1/ini/extract
// @access Private - Dev [not implemented]
const extractSection = async (req, res) => {
  if (USERPROFILE) {
    fs.readFile(paths.iniPath, 'utf8', (err, iniOne) => {
      if (err) {
        logger.error(err)
        return res.status(500).json({ error: err.message })
      }
      // TODO: use a prompt to enter extract value
        const linesOne = iniOne.split('\n')

        const EXTRACT_VALUE = 'Profile_' // <- section to extract
        const extracted = extractBySection(linesOne, EXTRACT_VALUE)

        res.status(200).json({
            message: RESPONSE.success[200],
            success: true,
            extracted,
        })
    })
  } else {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

// @desc extract sections in ini dynamically
// @path /api/0.0.1/ini/:section
// @access Private - Dev [not implemented]
const extractDynamic = async (req, res, next) => {
  const dynamicSection = await req.params.section
  let param;

  const normalizedDynamicSection = await normalizeParam(dynamicSection, TARGETS)
  switch (normalizedDynamicSection) {
    case 'profile':
      param = 'Profile'
      break
    case 'machineparameters':
      param = 'MachineParameters'
      break
    case 'llc':
      param = 'LLC'
      break
    case 'windowmode':
      param = 'WindowMode'
      break
    default:
      param = null
  }

  if (dynamicSection) {
    if (USERPROFILE) {
      fs.readFile(paths.iniPath, 'utf8', (err, data) => {
        if (err) {
          logger.error(err)
          return res.status(500).json({ error: err.message })
        }
        const lines = data.split('\n')
        const section = extractBySection(lines, String(param))

        res.status(200).json({
          message: RESPONSE.success[200],
          success: true,
          section
        })
      })
    } else {
      logger.error(`${USERPROFILE} NOT FOUND`)
      res.status(404).json({
        error: RESPONSE.error[404]
      })
    }
  } else {
    res.status(400)
    throw new Error('INVALID REQUEST')
  }
}



const extractController = { extractSection, extractDynamic }
module.exports = extractController