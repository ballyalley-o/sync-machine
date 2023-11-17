const fs = require('fs')
const fetch = require('node-fetch')
const { logger, iniLooper, asyncHandler } = require('../middleware')
const { paths, compareActions } = require('../utils')
const util = require('util')
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
    const readFileAsync = util.promisify(fs.readFile)
    const writeFileAsync = util.promisify(fs.writeFile)
    if(USERPROFILE) {
        try {
        const profile = await req.body

        // TODO: write the profile in the ini in a format
        try {
            const profileLength = await fetch(URL.ini.section('profile'), { method: 'GET' })
            const profileLengthJson = await profileLength.json()
            const profile = req.body;
            const { size } = profile;

            console.log(profileLengthJson)

            const profileData = `\n[Profile_${profileLength.length + 1}]\nSize: ${size}\n`;

            const filePath = paths.testFilesPath

            const iniContents = await readFileAsync(filePath, 'utf8')

            // TODO: logically add profile set depending on the last profile
            const profileSectionIndex =  + iniContents.indexOf('[LLCSocketData]')
            // const profileSectionIndex = lastProfileIndex !== -1 ? lastProfileIndex + ['Profile_3'] : iniContents.length + `\n`


            // this is spliting the [Profile_2] and its Size= 'Size=40.00X140.00'
            // format should be [Profile_(logically add 1 to the last Profile)] Size=40.00X140.00

            const updateContents = iniContents.slice(0, profileSectionIndex) + profileData + iniContents.slice(profileSectionIndex)

            await writeFileAsync(filePath, updateContents);

            res.status(200).json({
                message: RESPONSE.success.profile201,
                success: true,
                profileData
            })
        } catch (error) {
            console.error(error.message);
            res.status(400).json({ error: error.message });
        }

        } catch (error) {
            logger.error(error.message)
            res.status(400).json({error: error.message})
        }
    }
})


const profileController = { getProfiles, addProfile }
module.exports = profileController