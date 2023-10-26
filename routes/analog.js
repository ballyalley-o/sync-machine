const { analogController } = require('../controllers')
const express = require('express')

const router = express.Router()

/**
 * @path - baseUrl/api/0.0.1/analog
 */
router.get('/', analogController.analog_reader)


const analogRouter = router
module.exports = analogRouter