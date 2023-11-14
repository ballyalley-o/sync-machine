const { iniController, extractController } = require('../controllers')
const express = require('express')

const router = express.Router()

/**
 * @path - baseUrl/api/0.0.1/ini
 */
router.get('/', iniController.iniExtract)
router.get('/sim', iniController.iniSimulation)
router.get('/compare', iniController.iniCompare)
router.get('/extract', extractController.extractSection)
router.get('/:section', extractController.extractDynamic)


const iniRouter = router
module.exports = iniRouter