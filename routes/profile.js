const express = require('express')
const { profileController } = require('../controllers')

const router = express.Router()

router.get('/', profileController.getProfiles)
router.post('/', profileController.addProfile)


const profileRouter = router
module.exports = profileRouter