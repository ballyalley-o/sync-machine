const fs = require('fs')
const path = require('path')
const { global } = require('../constants')
const { logger } = require('../middleware')

const USERPROFILE = global.userProfile

// folder path to logs to fetch the latest log
const appStatePath = path.join(
  USERPROFILE,
  'AppData',
  'Roaming',
  'HowickHLCv3',
)

const fileType = {
  appState: 'appState',
  appWinState: 'appWindowState',
  howick: 'Howick',
}

const extType = {
  json: '.json',
  txt: '.txt',
  ini: 'ini'
}

/**
 * Grab the latest log file
 * @param {string} type
 * @param {string} ext
 * @param {func} callback
 */
const latestState = (type, ext, callback) => {
  fs.readdir(appStatePath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err)
      return
    }
    // Filter the files for appState
    const appFiles = files.filter(
      (file) => file.startsWith(fileType[type]) && file.endsWith(extType[ext]) && !file.includes('NEW')
    )

    if (appFiles.length === 0) {
      logger.log(`No ${type + ext} file found in the folder.`)
      if (callback) {
        callback(null, null)
      }
      return
    }

    logger.log('Appstate file:', appFiles)

    if (callback) {
      callback(null, appFiles)
    }
  })
}

const appStateLive = (type, ext) => {
  return new Promise((resolve, reject) => {
    latestState(type, ext, (err, latestState) => {
      if (err) {
        logger.error(err)
        reject(err)
      } else {
        logger.info('APP-STATE FILE: ', latestState)
        resolve(latestState)
      }
    })
  })
}

// const appStateFile = appStateLive('appState', 'json')

// console.log(appStateFile, 'APP STATE FILE')

module.exports = appStateLive
