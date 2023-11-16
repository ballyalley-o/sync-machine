const fs = require('fs')
const { logger, extractBySection, extractBySectionObj } = require('../middleware')
const { paths, normalize } = require('../utils')
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

        const EXTRACT_VALUE = '' // <- section to extract, default will extract all
        const extracted = extractBySectionObj(linesOne, EXTRACT_VALUE)

        res.status(200).json({
          message: RESPONSE.success[200],
          success: true,
          extracted
        })
    })
  } else {
    res.status(401).json({ error: RESPONSE.error[401] })
  }
}

// @desc extract sections in ini dynamically
// @path /api/0.0.1/ini/:section
// @access Private - Dev [not implemented]
const extractDynamic = async (req, res, next) => {
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

const extractController = { extractSection, extractDynamic }
module.exports = extractController