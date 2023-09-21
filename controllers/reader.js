const fs = require('fs')
const path = require('path')
const {global} = require('../constants')

const USERPROFILE = global.userProfile
const dynamicPath = path.join(
     USERPROFILE,
     'AppData',
     'Roaming',
     'HowickHLCv3',
     'appState.json'
   )


// reader
const reader = async (req, res) => {
  // const cwd = process.cwd()
  // const filePath = path.join(cwd, 'AppData', 'Roaming')

  if (USERPROFILE) {
     fs.readFile(dynamicPath, 'utf8', (err, data) => {
       if (err) {
         res.status(500).json({ error: 'Internal server error' })
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

//watcher
const watcher = async (req, res) => {
  if (USERPROFILE) {
    const watcher = fs.watch(dynamicPath, (eventType, filename) => {
      if (eventType === 'change') {
        try {
          console.log(`${filename} has changed`)
          // read the file
          fs.readFile(dynamicPath, 'utf8', (err, data) => {
            if (err) {
              res.status(500).json({ error: 'Internal server error' })
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

const readerController = { reader, watcher }

module.exports = readerController
