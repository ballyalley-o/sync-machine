const fs = require('fs')
const fetch = require('node-fetch')
const { logger, iniLooper, asyncHandler } = require('../middleware')
const { paths, compareActions } = require('../utils')
const { GLOBAL } = require('../config')
const { RESPONSE, URL } = require('../constants')

const USERPROFILE = GLOBAL.userProfile


// @desc Get the profiles from the ini
// @path GET /api/0.0.1/profile
// @access Private - Public [not implemented]
const getProfiles = asyncHandler(async(req, res, next) => {
    const profiles = await fetch(URL.ini.section('profile'), { method: 'GET' })

    if (USERPROFILE) {
     try {
        const profileData = await profiles.json()

        res.status(200).json(profileData.section)
     } catch (error) {
        logger.error(error.message)
        res.status(404).json({ error: error.message})
     }
    } else {
        res.status(404).json({ error: RESPONSE.error.userProfile404(USERPROFILE)})
    }
})

// @desc Add a profile to the ini
// @path POST /api/0.0.1/profile
// @access Private - Public [not implemented]
const addProfile = asyncHandler(async(req, res, next) => {
    if(USERPROFILE) {
        try {
        const profile = await req.body

        // TODO: write the profile in the ini in a format like this:
        // [Profile_(profile length + 1)]
        // Size: 50.00X150.00
        // using fs.writeFile


        } catch (error) {
            logger.error(error.message)
            res.status(400).json({error: error.message})
        }
    }
})


const profileController = { getProfiles }
module.exports = profileController