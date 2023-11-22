const {Schema, model} = require('mongoose')

TODO:// coil log schema
const CoilSchema = new Schema({
    dateTime : {
        type: String,
        required: true
    },
    coilBatchName: {
        type:String
    },
    coilLength: {
        type:String
    },
    coilWidth: {
        type:String
    },
    coilWeight: {
        type:String
    },
    coilDensity: {
        type:String
    },
    operator: {
        type:String
    }
},{
    collection: 'Coil'
})


const Coil = model('Coil', CoilSchema)
module.exports = Coil