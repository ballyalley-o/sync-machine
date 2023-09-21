const fs = require('fs')
const path = require('path')

const reader = async (req, res) => {
  // const cwd = process.cwd()
  // const filePath = path.join(cwd, 'AppData', 'Roaming')

  const userProfile = process.env.USERPROFILE

  if (userProfile) {
   const dynamicPath = path.join(userProfile, 'AppData', 'Roaming', 'HowickHLCv3', 'appState.json')
   console.log('dynamic path: ', dynamicPath)
     fs.readFile(dynamicPath, 'utf8', (err, data) => {
       if (err) {
         console.error('Error reading the JSON file:', err)
         res.status(500).json({ error: 'Internal server error' })
         return
       }

       try {
         const jsonData = JSON.parse(data)
         res.json(jsonData)
         console.log('connected to reader controller')
       } catch (parseError) {
         console.error('Error parsing JSON:', parseError)
         res.status(500).json({ error: 'Internal server error' })
       }
     })
  }


}

const readerController = { reader }

module.exports = readerController
