import fs from 'fs'
import express from 'express'
import PATH from '../constants/path'
import reader from '../controller/reader'

const app = express()
const PORT = 3000

app.get(PATH.home, reader())

app.listen(PORT, () => {
  console.log('Server listening on port 3000')
})
