import fs from 'fs'
import path from 'path'

const reader = async (req, res) => {
  const cwd = process.cwd()
  const filePath = path.join(cwd, '/data/appState.json')
  fs.readFile(filePath, 'utf8', (err, data) => {
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

const readerController = { reader }

export default readerController
