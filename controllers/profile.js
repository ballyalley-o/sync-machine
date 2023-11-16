const fs = require('fs')
const { logger, iniLooper, asyncHandler } = require('../middleware')
const { paths, compareActions } = require('../utils')
const { GLOBAL } = require('../config')
const { RESPONSE } = require('../constants')

const USERPROFILE = GLOBAL.userProfile


// @desc extract sections in ini dynamically
// @path /api/0.0.1/ini/:section
// @access Private - Dev [not implemented]
const getProfiles = asyncHandler(async(req, res, next) => {
    const profiles = await req.params.section
    console.log(profiles,'profiles')
    if (USERPROFILE) {
        if (profiles === 'profile') {
            console.log(profiles)
            res.status(200).json({profiles})
        } else {
            res.status(404).json({error: RESPONSE.error[404]})
        }
    } else {
        res.status(404).json({ error: RESPONSE.error.userProfile404(USERPROFILE)})
    }
})


const profileController = { getProfiles }
module.exports = profileController