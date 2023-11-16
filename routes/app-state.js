const { appStateController, analogController } = require('../controllers')
const express = require('express')

const router = express.Router()


/**
 * @path - baseUrl/api/0.0.1/app-state
 */
router.get('/', appStateController.reader)
// TODO: create a path for each logType
// router.get('/erp', readerController.liveWatchErp)
router.get('/extract', appStateController.extract)
router.get('/latest', appStateController.latestLog)
router.get('/win', appStateController.winState_reader)
router.get('/coil', appStateController.coilWatcher)
router.get('/analog', analogController.analog_reader)
router.get('/frames', appStateController.frameSetExtract)

const appStateRouter = router
module.exports = appStateRouter
