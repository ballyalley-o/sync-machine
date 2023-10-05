const fs = require('fs')
const path = require('path')
const {global} = require('../constants')
const {logger, logLooper} = require('../middleware')

// const operationsLog =
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
  'ERP_log_2023-10-05.txt'
)

// reader
const reader = async (req, res) => {

  if (USERPROFILE) {
     fs.readFile(dynamicPath, 'utf8', (err, data) => {
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
    fs.readFile(dynamicPath_txt, 'utf8', (err, data) => {
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

// reader Erp
const readerErpTXT = async (req, res) => {

  if (USERPROFILE) {
     fs.readFile(erpPath_txt, 'utf8', (err, data) => {
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


// reader for txt files
const erpGraphCompute = async (req, res ) => {
  if (USERPROFILE) {
    fs.readFile(erpPath_txt, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: err })
        return
      }
      try {
        const lines = data.split('\n')
        logger.log(lines)
        const components = lines.length

        const { total } = logLooper(lines, 'length')

        let mmSum = total
        console.log(mmSum, 'mmSum')
        // // meters
        // let mmSum = 0

        // for (let i = 0; i < lines.length; i++) {
        //   if (lines[i].includes(',')) {
        //     const lineArr = lines[i].split(',')
        //     const mmEl = parseFloat(lineArr[11])

        //     if (!isNaN(mmEl)) {
        //       mmSum += mmEl
        //     }
        //   }
        // }

        // seconds
        let secsTotal = 0

        for (let i = 0; i <lines.length; i++) {
          const lineArr = lines[i].split(',')
          const timeEl = parseFloat(lineArr[13])

          if (!isNaN(timeEl)) {
            secsTotal += timeEl
          }
        }

        // waste
        let wasteTotal = 0

        for (let i = 0; i < lines.length; i++) {
          const lineArr = lines[i].split(',')
          const wasteEl = parseFloat(lineArr[12])

          if (!isNaN(wasteEl)) {
            wasteTotal += wasteEl
          }
        }

        const mmToM = mmSum / 1000
        const wasteToM = wasteTotal / 1000
        const secsPerComponent = secsTotal / components
        const Total = mmToM + wasteToM

        const graphAvg = mmSum / secsPerComponent

        const totalSum = {
          graphAverage: graphAvg,
          components,
          milimeter: mmSum,
          meter: mmToM,
          waste: wasteTotal,
          wasteM: wasteToM,
          total: Total,
          seconds: secsTotal,
          secsPerComponent,
        }

        res.status(200).json(totalSum)
      } catch (err) {
        res.status(500).json({ error: err })
      }
    })
  }
}

// watcher
const watcher = async (req, res) => {
  if (USERPROFILE) {
    const watcher = fs.watch(dynamicPath, (eventType, filename) => {
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
  erpGraphCompute,
}
module.exports = readerController
