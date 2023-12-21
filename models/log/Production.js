const mongoose = require('mongoose')
const { Schema, model } = require('mongoose')

// production log schema
const ProductionSchema = new Schema(
  {
    dateTime: {
      type: String,
      required: true,
    },
    frameSet: {
      type: String,
    },
    componentName: {
      type: String,
    },
    componentLength: {
      type: String,
    },
    flangeHeight: {
      type: String,
    },
    webWidth: {
      type: String,
    },
    flangeHeight: {
      type: String,
    },
    unit: {
      type: String,
    },
    isModified: {
      type: String,
      // TODO: if UnModified have the value as false
    },
  },
  {
    timestamps: true,
    collection: 'Production',
  }
)

const Production = mongoose.model('Production', ProductionSchema)
module.exports = Production
