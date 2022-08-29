const { Schema, model } = require('mongoose')

const VariablesSchema = new Schema({
  startTime: {
    type: String,
    required: true,
    default: '0 10 * * *',
  },
  stopTime: {
    type: String,
    required: true,
    default: '0 19 * * *',
  },
  cleanerTime: {
    type: String,
    required: true,
    default: '* * */1 * *',
  },
  folderCleanerTime: {
    type: Number,
    required: true,
    default: 7,
  },
  fileCounter: {
    type: Number,
    required: true,
    default: 5,
  },
  photoLimit: {
    type: Number,
    required: true,
    default: 10,
  },
})

const variablesModel = model('variable', VariablesSchema)

module.exports = variablesModel
