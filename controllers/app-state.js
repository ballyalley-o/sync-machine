const fs = require('fs')
const {logger, logLooper} = require('../middleware')
const { paths, logLive } = require('../utils')
const { GLOBAL } = require('../config')


const USERPROFILE = GLOBAL.userProfile
let totalSum
let coilSpecs


// @desc Reader for Production log
// @file appState.json
// @path /api/v1/app-state
// @access Public [not implemented]
const reader = async (req, res) => {
  if (USERPROFILE) {
     fs.readFile(paths.dynamicRootPath('appState.json'), 'utf8', (err, data) => {
       if (err) {
         res.status(500).json({ error: err })
         return
       }
       try {
         const jsonData = JSON.parse(data)
         logger.log('READER:', jsonData.config.ConfigurationFormat.HLCVersion)

          res.json(jsonData)

       } catch (err) {

         logger.error('Error parsing JSON:', err)

         res
         .status(500)
         .json({err: err.message})
       }
     })
  }
}


// @desc Reader for windowState
// @file appWindowState.json
// @path /api/v1/app-state/win
// @access Public [not implemented]
const winState_reader = async (req, res) => {
  if (USERPROFILE) {
    fs.readFile(
      paths.dynamicRootPath('appWindowState.json'),
      'utf8',
      (err, data) => {
        if (err) {
          res.status(500).json({ error: err })
          return
        }
        try {

          const jsonData = JSON.parse(data)

          res.json(jsonData)
        } catch (err) {

          logger.error('Error parsing JSON:', err)

          res
          .status(500)
          .json({err: err.message})
        }
      }
    )
  }
}

// @desc Reader for ERP log
// @path /api/v1/app-state/erp
// @access Public [not implemented]
const readerErpTXT = async (req, res) => {

  if (USERPROFILE) {
     fs.readFile(paths.erpPath_txt, 'utf8', (err, data) => {
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

         logger.error('Error parsing JSON:', err)

         res
         .status(500)
         .json({ error: err.message })
       }
     })
  }
}

// @desc --
// @path /api/v1/app-state/latest
// @access Public [not implemented]
const latestLog = async (req, res) => {
 try {
   if (USERPROFILE) {
      let promisePath;
     const live = await paths
       .livePath('erp', 'txt')
       .then((result) => {
        promisePath = result
        return promisePath
       })
      console.log(promisePath, 'promises')
     const data = await fs.promises.readFile(promisePath, 'utf8')
     const lines = data.split('\n')
     logger.log(lines)
     const components = lines.length
     console.log(components)
   }
 } catch (err) {
    res.status(500).json({ error: err.message })
 }
}


// @desc Totals and data extactor
// @path /api/v1/app-state/extract
// @access Public [not implemented]
const extract = async (req, res ) => {
  if (USERPROFILE) {
    // grab some data from appstate.json
    let appStatePath
    let jsonData

    await paths.rootPath('appState', 'json').then((result) => {
      appStatePath = result
      logger.log(appStatePath, 'APP STATE PATH')
      return appStatePath
    })

    fs.readFile(appStatePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }

      try {
        jsonData = JSON.parse(data)
        return jsonData
      } catch (err) {

        logger.error('Error parsing JSON:', err)

        res
        .status(500)
        .json({ error: err.message })
      }
    })

    // --------------------------------------------------------
    /**
     * grab the latest log
     */
    let promisePath
    await paths.livePath('erp', 'txt').then((result) => {
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
        const components = lines.length

        //hmi version
        const HMIVersion= jsonData.config.ConfigurationFormat.HLCVersion
        //  collect Data
        const lengthTotal = logLooper(lines, 'length')
        const secsTotal = logLooper(lines, 'time')
        const wasteTotal = logLooper(lines, 'waste')

        //  compute data
        const mmToM = lengthTotal / 1000
        const wasteInMeters = wasteTotal / 1000
        const secsPerComponent = secsTotal / components
        const totalInMeters = mmToM + wasteInMeters
        const graphAvg = lengthTotal / secsPerComponent

        // coil properties
        const coilOuterDiameter=jsonData.config.appStateConfigParams.coilOuterDiameter
        const coilInnerDiameter=jsonData.config.appStateConfigParams.coilInnerDiameter
        const coilThickness = jsonData.config.appStateConfigParams.coilThickness
        const coilLength = jsonData.config.appStateConfigParams.coilLength
        const coilWidth = jsonData.config.appStateConfigParams.coilWidth
        const coilWeight = jsonData.config.appStateConfigParams.coilWeight
        const coilCoating = jsonData.config.appStateConfigParams.coilCoating
        const coilBatchName = jsonData.config.appStateConfigParams.coilBatchName
        const previousCoilBatchName = jsonData.config.appStateConfigParams.previousCoilBatchName

        // coil length live form
        const coilLengthEq = `${coilLength} = π(${coilOuterDiameter}² - ${coilInnerDiameter}²) / 4(${coilThickness}) * 1000`

        const HOSTNAME = GLOBAL.host

        totalSum = {
          sequenceNumber: jsonData.componentSequenceNumberCounter,
          LogFileName: promisePath,
          graphAverage: graphAvg,
          components,
          milimeter: lengthTotal,
          meter: mmToM,
          waste: wasteTotal,
          wasteInMeters,
          totalInMeters,
          total: lengthTotal + wasteTotal,
          seconds: secsTotal,
          secsPerComponent,
        }

        coilSpecs = {
          batch: coilBatchName,
          length: coilLength,
          outer_diameter: coilOuterDiameter,
          inner_diameter: coilInnerDiameter,
          thickness: coilThickness,
          width: coilWidth,
          weight: coilWeight,
          coating: coilCoating,
          previous_batch: previousCoilBatchName,
        }
        res
          .status(200)
          .json({ Machine: HOSTNAME, HMIVersion, totalSum, coilSpecs, coilLengthEq })
      } catch (err) {

        res
        .status(500)
        .json({ error: err.message })
      }
    })
  }
}


// @desc extract framesSet
// @path /api/v1/app-state/frames
// @access Public [not implemented]
const frameSetExtract = async (req, res) => {
  if (USERPROFILE) {
    let appStatePath
    let appData

    await paths.rootPath('appState', 'json').then((result) => {
      appStatePath = result
      logger.log(appStatePath, 'APP STATE PATH')
      return appStatePath
    })

    fs.readFile(appStatePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({error: err.message})
      }
        try {
            const jsonData = JSON.parse(data)
            appData = jsonData.frameSet.frames

            //declare the arr
            const parentFrameIds = []

            // loop to find the parent id
            for (let frame = 0; frame < appData.length; frame++) {
              const parentId = appData[frame].id


              parentFrameIds.push({
                id: parentId
              })
            }


            res.status(200).json({ appData, parentFrameIds })
        } catch (err) {
            logger.error(err)
            res
            .status(500)
            .json({error: err.message})
        }
    })
  }
}


// @desc Watcher for logs
// @path /api/v1/app-state/watch
// @access Public [not implemented]
const logWatcher = async (req, res) => {
  if (USERPROFILE) {
    const watcher = fs.watch(paths.dynamicRootPath('appState.json'), (eventType, filename) => {
      if (eventType === 'change') {
        try {
          console.log(`${filename} has changed`)
          // read the file
          fs.readFileSync(dynamicRootPath, 'utf8', (err, data) => {
            if (err) {
              res.status(500).json({ error: err })
              return
            }
            try {
              const jsonData = JSON.parse(data)
              res.json(jsonData)
            } catch (err) {
              console.error('Error parsing JSON:', parseError)
              res
              .status(500)
              .json({ error: err.message })
            }
          })
        } catch (err) {

          logger.error(err.message)
          res
            .status(500)
            .json({error: err.message})

        }
      }
    })

    // close the watcher when an error occured
    watcher.on('error', (error) => {
      console.log('error while watching the data', error)
    })

    process.on('SIGNT', () => {
      watcher.close()
      process.exit()
    })
  } else {
    console.log('USERPROFILE is not provided')
  }
}


// ----------------------------------------------------------------
// warning: a bit messy, clean-up will be done after

// @desc R&D for watching coil log
// @path /api/v1/app-state/coil
// @access Public [not implemented]
const coilWatcher = async (req, res) => {

  let promisePath

  if (USERPROFILE) {
    const filePath = await paths.livePath('coil', 'txt').then((result) => {
      promisePath = result
      logger.log(promisePath)
      return promisePath
    })

    try {
      // const watchErp = chokidar.watch(filePath)
      // Start the watcher
     fs.readFile(promisePath, 'utf8', (err, data) => {
       if (err) {
         res.status(500).json({ error: err.message })
         return
       }
       try {
          const lines = data.split('\n')

          res.status(200).json(lines)
       } catch (err) {
         logger.error('Error parsing JSON:', err, err)

         res
         .status(500)
         .json({ error: err.message })
       }
     })
    } catch (err) {
      logger.error(err)

      res
      .status(500)
      .send({ error: err.message })
    }
  } else {
    console.log('USER PROFILE NOT FOUND')
    res.status(403).send('User profile not found')
  }
}

const appStateController = {
  reader,
  logWatcher,
  readerErpTXT,
  extract,
  coilWatcher,
  latestLog,
  winState_reader,
  frameSetExtract
}

module.exports = appStateController
