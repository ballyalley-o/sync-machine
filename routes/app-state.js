const { appStateController } = require('../controllers')
const express = require('express')

const router = express.Router()


/**
 * @path - baseUrl/api/0.0.1/app-state
 */
router.get('/', appStateController.reader)
router.get('/watch', appStateController.watcher)
router.get('/txt', appStateController.readerTXT)
// TODO: create a path for each logType
// router.get('/erp', readerController.liveWatchErp)
router.get('/erpLatest', appStateController.erpLive)
router.get('/latest', appStateController.latestLog)
router.get('/winState', appStateController.winState_reader)
router.get('/coil', appStateController.coilWatcher)

const appStateRouter = router
module.exports = appStateRouter
