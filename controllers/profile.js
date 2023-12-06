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
            let isDuplicate = false;
            const profileFetch = await fetch(URL.ini.section('profile'), { method: 'GET' })
            const profileJson = await profileFetch.json()
            const profile = req.body;
            const { flange, web } = profile;

            const profileSection = Object.entries(profileJson.section)

            const profileSet = `${flange}X${web}`
            const profileData = `\n[Profile_${profileSection.length}]\nSize=${profileSet}\n`;

            const filePath = paths.iniPath

            const iniContents = await readFileAsync(filePath, 'utf8')

            const profileSectionIndex = iniContents.indexOf('\n[LLCSocketData]')

            const updateContents = iniContents.slice(0, profileSectionIndex) + profileData + iniContents.slice(profileSectionIndex)

            await writeFileAsync(filePath, updateContents);

            for (const [profileName, profileData] of profileSection) {
                const existingSize = profileData.Size;

                if (existingSize === profileSet) {
                    isDuplicate = true;
                    break;
                }
            }

            if (isDuplicate) {
                throw new Error(`${profileData} already exists`);
            } else {
                res.status(200).json({
                    message: RESPONSE.success.profile201(profileSection.length),
                    success: true,
                    profileData
                });
            }
        } catch (error) {
            console.error(error.message);
            res.status(400).json({ error: error.message });
        }

    }
})


const profileController = { getProfiles, addProfile }
module.exports = profileController
