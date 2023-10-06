const path = require('path')
const fileName = require('./file-path')
const { global } = require('../constants')
const logLive = require('./latest')
const { logger, asyncHandler } = require('../middleware')

const USERPROFILE = global.userProfile

const dynamicPath = path.join(
  USERPROFILE,
  'AppData',
  'Roaming',
  'HowickHLCv3',
  'appState.json'
)
const dynamicPath_txt = path.join(
  USERPROFILE,
  'AppData',
  'Roaming',
  'HowickHLCv3',
  'logs',
  'OPERATIONS_log_2023-10.txt'
)
const erpPath_txt = path.join(
  USERPROFILE,
  'AppData',
  'Roaming',
  'HowickHLCv3',
  'logs',
  fileName
)

const pathDir = (live) => path.join(
  USERPROFILE,
  'AppData',
  'Roaming',
  'HowickHLCv3',
  'logs',
  live
)

async function livePath(logPath, ext) {
    try {
        const live = await logLive(logPath, ext)
        const PathDir = pathDir(live)
         return PathDir
    } catch (error) {
        logger.error(error)
        return null
    }
}
// livePath('erp', 'txt')

const PATHDIR = livePath('erp', 'txt')
  .then((path) => {
    const PATHDIR = path
    return
  })
  .catch((error) => {
    logger.error(error.message)
  })


const paths = { dynamicPath, dynamicPath_txt, erpPath_txt, livePath }
module.exports = paths
