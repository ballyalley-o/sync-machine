const fs = require('fs')
const path = require('path')
const {global} = require('../constants')

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
         console.error('Error parsing JSON:', parseError)
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
          console.log(line)
        }

        res.status(200).json(lines)
      } catch (err) {
        res.status(500).json({ error: err})
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

const readerController = { reader, watcher, readerTXT }
module.exports = readerController
