const { Schema, model } = require('mongoose')

const ERPSchema = new Schema(
  {
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
    web: {
      type: String,
    },
    flange: {
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
  },
  {
    timestamps: true,
    collection: 'ERP',
  }
)

const ERP = model('ERP', ERPSchema)
module.exports = ERP
