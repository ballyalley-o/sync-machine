const express = require('express')
const { profileController } = require('../controllers')

const router = express.Router()

router.get('/', profileController.getProfiles)


const profileRouter = router
module.exports = profileRouter