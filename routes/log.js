const { logController } = require('../controllers')
const express = require('express')
const { parsedCoilLog } = require('../controllers/log')

const router = express.Router()

/**
 * @path - baseUrl/api/v1/log
 */
router.get('/coil', logController.coilLog)
router.get('/parsed-coil-log', logController.parsedCoilLog)
router.get('/sys', logController.sysLog)
router.get('/erp', logController.erpLog)
router.get('/production', logController.productionLog)

const logRouter = router
module.exports = logRouter
