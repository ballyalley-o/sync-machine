const mongoose = require('mongoose')
const { Schema, model } = require('mongoose')

// production log schema
const ProductionSchema = new Schema(
  {
    dateTime: {
      type: String,
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
    flange: {
      type: String,
    },
    web: {
      type: String,
    },
    unit: {
      type: String,
    },
    // was thinking to name this field to isModified but might be confusing since it is conventionally used for booleans
    // FIXME: change name variation of this field
    modClassifier: {
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
