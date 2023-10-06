const fs = require('fs')
const path = require('path')
const {logger, logLooper} = require('../middleware')
const { paths, logLive } = require('../utils')
const { global } = require('../constants')


const USERPROFILE = global.userProfile

// reader
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

// reader Erp
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

   }
 } catch (error) {
    res.status(500).json({ error: error.message })
 }
}


// reader for txt files
const erpGraphCompute = async (req, res ) => {
  // const live = await logLive('erp', 'txt')
  // console.log(live)
  if (USERPROFILE) {
     fs.readFile(paths.erpPath_txt, 'utf8', (err, data) => {

       if (err) {
         res.status(500).json({ error: err })
         return
       }
       try {
         const lines = data.split('\n')
         logger.log(lines)
         const components = lines.length

         // const { total } = logLooper(lines, 'length')

         // let mmSum = total
         // console.log(mmSum, 'mmSum')
         // meters
         let mmSum = 0

         for (let i = 0; i < lines.length; i++) {
           if (lines[i].includes(',')) {
             const lineArr = lines[i].split(',')
             const mmEl = parseFloat(lineArr[11])
             if (!isNaN(mmEl)) {
               mmSum += mmEl
             }
           }
         }

         // seconds
         let secsTotal = 0

         for (let i = 0; i < lines.length; i++) {
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

// watcher| live
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
  erpGraphCompute,
  latestLog,
}
module.exports = readerController
