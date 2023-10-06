const fs = require('fs')
const path = require('path')
const {logger, logLooper} = require('../middleware')
const { paths, logLive } = require('../utils')
const { global } = require('../constants')


const USERPROFILE = global.userProfile

// @desc Reader for Production log
// @file appState.json
// @path /api/v1/reader
// @access Public [not implemented]
const reader = async (req, res) => {

  if (USERPROFILE) {
     fs.readFile(paths.dynamicPath, 'utf8', (err, data) => {
       if (err) {
         res.status(500).json({ error: err })
         return
       }
       try {
         const jsonData = JSON.parse(data)
         res.json(jsonData)
       } catch (parseError) {
         logger.error('Error parsing JSON:', parseError)
         res.status(500).json({ error: 'Internal server error' })
       }
     })
  }
}

// reader for txt files
const readerTXT = async (req, res ) => {
  if (USERPROFILE) {
    fs.readFile(paths.dynamicPath_txt, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: err})
        return
      } try {
        const lines = data.split('\n')

        for (const line of lines) {
          logger.log(line)
        }

        res.status(200).json(lines)
      } catch (err) {
        res.status(500).json({ error: err})
      }
    })
  }
}

// @desc Reader for ERP log
// @path /api/v1/reader/erp
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
       } catch (parseError) {
         logger.error('Error parsing JSON:', parseError)
         res.status(500).json({ error: 'Internal server error' })
       }
     })
  }
}

// @desc --
// @path /api/v1/reader/latest
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
 } catch (error) {
    res.status(500).json({ error: error.message })
 }
}


// @desc Totals for ERP log
// @path /api/v1/reader/erpLatest
// @access Public [not implemented]
const erpLive = async (req, res ) => {

  if (USERPROFILE) {
        // grab the latest log
       let promisePath;
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
         logger.log(lines)
         const components = lines.length

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

         const totalSum = {
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
         res.status(200).json(totalSum)
       } catch (err) {
         res.status(500).json({ error: err.message })
       }
     })
  }
}

// @desc Watcher for logs
// @path /api/v1/reader/watch
// @access Public [not implemented]
const watcher = async (req, res) => {
  if (USERPROFILE) {
    const watcher = fs.watch(paths.dynamicPath, (eventType, filename) => {
      if (eventType === 'change') {
        try {
          console.log(`${filename} has changed`)
          // read the file
          fs.readFileSync(dynamicPath, 'utf8', (err, data) => {
            if (err) {
              res.status(500).json({ error: err })
              return
            }
              try {
                const jsonData = JSON.parse(data)
                res.json(jsonData)
              } catch (parseError) {
                console.error('Error parsing JSON:', parseError)
                res.status(500).json({ error: parseError })
              }
          })
        } catch (error) {
          console.log(error)
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

const readerController = {
  reader,
  watcher,
  readerTXT,
  readerErpTXT,
  erpLive,
  latestLog,
}
module.exports = readerController
