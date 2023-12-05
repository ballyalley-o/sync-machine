const fs = require('fs')
const fetch = require('node-fetch')
const {logger, logLooper} = require('../middleware')
const { paths, logLive } = require('../utils')
const { GLOBAL } = require('../config')
const { RESPONSE } = require('../constants')
const { URL } = require('../constants')

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
      logger.log(appStatePath)
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
        logger.error(RESPONSE.error.parseErr(err.message))
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

// TODO: tool operation count
// @desc extract toolcount to match with the tool itself
// @path /api/v1/app-state/tool-count
// @access Public [not implemented]
const toolCountExtract = async (req, res) => {
  if (USERPROFILE) {
    // grab some data from appstate.json
    let appStatePath
    let jsonData

    const toolCountFetch = await fetch(URL.app_state.this, {
      method: 'GET',
    })

    const appStateState = await toolCountFetch.json()

    // get the tooldef from api/0.0.1/ini/toolDef
    const toolDefFetch = await fetch(URL.ini.section('toolDef'), {
      method: 'GET'
    })

    const toolDefIni = await toolDefFetch.json()


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
        //hmi version
        const HMIVersion= appStateState.config.ConfigurationFormat.HLCVersion
        const HOSTNAME = GLOBAL.host

        // toolcount properties from app state
        const toolsCount = appStateState.toolsCount
        let toolIndex = ''
        let toolOperation = ''

        const toolsCountData = toolsCount.data
        const toolDef = toolDefIni.section


        const toolOperations = []

        Object.entries(toolDef).forEach(([toolDefKey, toolDefValue]) => {

          const toolDefNumber = parseInt(toolDefKey.replace("ToolDef_", ""))
          const matchingToolCountData = toolsCountData.find(data => data[0] === toolDefNumber);

          if (matchingToolCountData) {

            const [toolNumber, operation] = matchingToolCountData

            const toolOperation = {
              [toolDefNumber]: {
                referenceName: toolDefValue.ReferenceName,
                position: parseInt(toolDefValue.position),
                operations: parseInt(operation)
              },
            };
            toolOperations.push(toolOperation);
          }
        });

        res
          .status(200)
          .json({ Machine: HOSTNAME, HMIVersion, toolCount: toolsCount.data, toolOperations })
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

// @desc R&D for watching coil log
// @path /api/v1/app-state/coil
// @access Public [not implemented]
const coilWatcher = async (req, res) => {

  let promisePath

  if (USERPROFILE) {
    await paths.livePath('coil', 'txt').then((result) => {
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
         logger.error(RESPONSE.error.parseErr(err.message))

         res
         .status(500)
         .json({ error: err.message })
       }
     })
    } catch (err) {
      logger.error(err)

      res
      .status(500)
      .json({ error: err.message })
    }
  } else {
    logger.error(RESPONSE.error.userProfile404(USERPROFILE))
    res.status(404).json({error: error.message})
  }
}

const appStateController = {
  reader,
  readerErpTXT,
  extract,
  toolCountExtract,
  coilWatcher,
  latestLog,
  winState_reader,
  frameSetExtract
}

module.exports = appStateController


// const toolDefArray = Object.entries(toolDef).map(([key, value]) => ({ key, value }));

// const toolsCountData = [
//   [1, 2980],
//   [2, 7628],
//   [3, 6595],
//   [7, 777],
//   [5, 7459],
//   [17, 2583],
//   [4, 526],
//   [6, 25],
//   [11, 1],
//   [12, 1],
//   [10, 1],
// ];

// const toolOperations = [];

// toolDefArray.forEach(({ key, value }) => {
//   const toolDefNumber = parseInt(key.replace("ToolDef_", "")) + 1;

//   const matchingToolCountData = toolsCountData.find(data => data[0] === toolDefNumber);

//   if (matchingToolCountData) {
//     const [toolNumber, operations] = matchingToolCountData;
//     const toolOperation = {
//       [key]: {
//         referenceName: value.ReferenceName,
//         operations,
//       },
//     };
//     toolOperations.push(toolOperation);
//   }
// });

// console.log(toolOperations);
