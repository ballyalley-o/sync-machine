const readerController = require('../controllers/reader.js')
const express = require('express')

const router = express.Router()

router.get('/', readerController.reader)
router.get('/watch', readerController.watcher)
router.get('/txt', readerController.readerTXT)

const readerRouter = router
module.exports = readerRouter
