const { Schema, model } = require('mongoose')

const ERPSchema = new Schema({
  dateTime: {
    type: String,
    required: true,
  },
  operator: {
    type: String,
  },
  coilBatchName: {
    type: String,
  },
  // coil/componentWidth
  coilWidth: {
    type: String,
  },
  coilThickness: {
    type: String,
  },
  coilLength: {
    type: String,
  },
  frameSet: {
    type: String,
  },
  componentLabel: {
    type: String,
  },
  webWidth: {
    type: String,
  },
  flangeHeight: {
    type: String,
  },
  profileShape: {
    type: String,
  },
  componentLength: {
    type: String,
  },
  waste: {
    type: String,
  },
  time: {
    type: String,
  },
  componentWeight: {
    type: String,
  },
})

const ERP = model('ERP', ERPSchema)
module.exports = ERP
