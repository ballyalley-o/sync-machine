const readerController = require('../controllers/reader.js')
const express = require('express')

const router = express.Router()

router.get('/', readerController.reader)
router.get('/watch', readerController.watcher)

const readerRouter = router
module.exports = readerRouter
