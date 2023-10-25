const { analogController } = require('../controllers')
const express = require('express')

const router = express.Router()

/**
 * @path - baseUrl/api/v1/app-state
 */
router.get('/state', analogController.analog_reader)


const analogRouter = router
module.exports = analogRouter