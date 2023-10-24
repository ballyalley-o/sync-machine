const { logController } = require('../controllers')
const express = require('express')

const router = express.Router()

/**
 * @path - baseUrl/api/v1/log
 */
router.get('/coil', logController.coilLog)
// router.get('/erp', readerController.watcher)

const logRouter = router
module.exports = logRouter
