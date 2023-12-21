const { iniController } = require('../controllers')
const express = require('express')

const router = express.Router()

/**
 * @path - baseUrl/api/0.0.1/ini
 */
router.get('/', iniController.extractIni)
router.get('/sim', iniController.simulationIni)
router.get('/compare', iniController.compareIni)
router.get('/custom', iniController.customIni)
router.get('/:section', iniController.dynamicIni)

const iniRouter = router
module.exports = iniRouter
