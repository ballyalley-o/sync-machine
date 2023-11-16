const path = require('path')
const fileName = require('./file-path')
const { GLOBAL } = require('../config')
const logLive = require('./latest')
const appStateLive = require('./appState-latest')
const { logger, asyncHandler } = require('../middleware')

const USERPROFILE = GLOBAL.userProfile

const testFilesPath = path.join(__dirname, '..', 'data', 'Howick.ini')
const testSysLogPath = path.join(__dirname, '..', 'data', 'SYSTEM_log_2023-12.txt')

const dynamicRootPath = (fileName) =>
  path.join(USERPROFILE, 'AppData', 'Roaming', 'HowickHLCv3', fileName)


const iniPath = path.join(
  USERPROFILE,
  'AppData',
  'Roaming',
  'HowickHLCv3',
  'Howick.ini'
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

async function rootPath(fileName, ext) {
    try {
        const file = await appStateLive(fileName, ext)
        let appState

        if (file.length === 1) {
          appState = file.pop()
        }

        const PathDir = dynamicRootPath(appState)
        return PathDir
    } catch (error) {
        logger.error(error.message)
        return null
    }
}


const paths = {
  testFilesPath,
  dynamicRootPath,
  dynamicPath_txt,
  erpPath_txt,
  livePath,
  rootPath,
  iniPath,
  testSysLogPath
}
module.exports = paths
