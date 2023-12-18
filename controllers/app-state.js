const fs = require('fs')
const fetch = require('node-fetch')
const {logger, logLooper} = require('../middleware')
const { paths, latestLogFile } = require('../utils')
const { GLOBAL } = require('../config')
const { RESPONSE } = require('../constants')
const { URL } = require('../constants')

const USERPROFILE = GLOBAL.userProfile
let totalSum
let coilSpecs


// @desc Extract appState file
// @file appState.json
// @path /api/v1/app-state
// @access Public [not implemented]
const extractAppState = async (req, res) => {
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
const winAppState = async (req, res) => {
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

// @desc Totals and data extactor
// @path /api/v1/app-state/extract
// @access Public [not implemented]
const customAppState = async (req, res ) => {
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
    await paths.latestLogPath('erp', 'txt').then((result) => {
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

// @desc analog dialog extract
// @file appState.json
// @path /api/v1/app-state/analog
// @access Public [not implemented]
const analogAppState = async (req, res) => {
  if (USERPROFILE) {
    fs.readFile(paths.dynamicRootPath('appState.json'), 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: err })
        return
      }
      try {
        const jsonData = JSON.parse(data)

        const hydraulicPressure = jsonData.config.Analogue_Display_0
        const airPressure = jsonData.config.Analogue_Display_1
        const decoilerArm = jsonData.config.Analogue_Display_2
        const oilTemp = jsonData.config.Analogue_Display_3
        const driveCurrent = jsonData.config.Analogue_Display_4
        const driveFrequency = jsonData.config.Analogue_Display_5

        const analogDisplay = {
            Hydraulic_Pressure: hydraulicPressure,
            Air_Pressure: airPressure,
            Decoiler_Arm: decoilerArm,
            Oil_Temp: oilTemp,
            Drive_Current: driveCurrent,
            Drive_Frequency: driveFrequency
        }

        res.status(200).json(analogDisplay)
      } catch (parseError) {
        logger.error('Error parsing JSON:', parseError)
        res.status(500).json({ error: parseError.message })
      }
    })
  }
}

// @desc extract toolcount to match with the tool itself
// @path /api/v1/app-state/tool-count
// @access Public [not implemented]
const toolCountAppState = async (req, res) => {
  if (USERPROFILE) {

    const toolCountFetch = await fetch(URL.app_state.this, {
      method: 'GET',
    })
    const toolCountState = await toolCountFetch.json()

    // get the tooldef from api/0.0.1/ini/toolDef
    const toolDefFetch = await fetch(URL.ini.section('toolDef'), {
      method: 'GET'
    })

    const toolDefIni = await toolDefFetch.json()


    let promisePath
    await paths.latestLogPath('erp', 'txt').then((result) => {
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
        const HMIVersion= toolCountState.config.ConfigurationFormat.HLCVersion
        const HOSTNAME = GLOBAL.host

        // toolcount properties from app state
        const toolsCount = toolCountState.toolsCount
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
                offset: parseInt(toolDefValue.Position),
                operations: parseInt(operation)
              },
            };
            toolOperations.push(toolOperation);
          }
        });

        res
          .status(200)
          .json({ Machine: HOSTNAME, HMIVersion, toolOperations })
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
const frameSetAppState = async (req, res) => {
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

const appStateController = {
  extractAppState,
  customAppState,
  toolCountAppState,
  winAppState,
  analogAppState,
  frameSetAppState
}

module.exports = appStateController
