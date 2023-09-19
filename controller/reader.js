import fs from 'fs'

const reader = async (req, res) => {
 fs.readFile(filePath, 'utf8', (err, data) => {
   if (err) {
     console.error('Error reading the JSON file:', err)
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

export default reader
