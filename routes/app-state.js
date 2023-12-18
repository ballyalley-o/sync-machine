const { appStateController } = require('../controllers')
const express = require('express')

const router = express.Router()

/**
 * @path - baseUrl/api/0.0.1/app-state
 */
router.get('/', appStateController.extractAppState)
router.get('/custom', appStateController.customAppState)
router.get('/win', appStateController.winAppState)
router.get('/analog', appStateController.analogAppState)
router.get('/frames', appStateController.frameSetAppState)
router.get('/tool-count', appStateController.toolCountAppState)

const appStateRouter = router
module.exports = appStateRouter
