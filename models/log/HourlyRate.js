const { Schema, model } = require('mongoose')

const HourlyRateSchema = new Schema(
  {
    dateTime: {
      type: String,
      required: true,
    },
    produced: {
      type: String,
    },
    waste: {
      type: String,
    },
  },
  { collection: 'HourlyRate' }
)

const HourlyRate = model('HourlyRate', HourlyRateSchema)
module.exports = HourlyRate
