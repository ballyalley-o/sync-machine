const readerController = require('../controllers/reader.js')
const express = require('express')

const router = express.Router()

router.get('/', readerController.reader)

const readerRouter = router
module.exports = readerRouter
