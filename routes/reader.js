const readerController = require('../controllers/reader.js')
const express = require('express')

const router = express.Router()

router.get('/', readerController.reader)
router.get('/watch', readerController.watcher)
router.get('/txt', readerController.readerTXT)
router.get('/erp', readerController.readerErpTXT)
router.get('/erpGraph', readerController.erpGraphCompute)

const readerRouter = router
module.exports = readerRouter
