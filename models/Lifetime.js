const {Schema, model} = require('mongoose')

TODO:// Lifetime log schema
const LifeTimeSchema = new Schema({
    dateTime : {
        type: String,
        required: true
    },
})