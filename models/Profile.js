const { Schema, model} = require('mongoose')


const ProfileSchema = new Schema({
    Size: {
        type: String,
        match: [/^\d{2,3}\.\d{2}X\d{2,3}\.\d{2}$/, 'Please put a valid Profile (webWidth x flangeHeight)'],

    }
}, {collection: 'Profile'})



const Profile = model('Profile', ProfileSchema)
module.exports = Profile