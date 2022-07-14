const { Schema, model } = require('mongoose')
const uuid = require('uuid')
const FolderSchema = new Schema({
  uuid: {
    type: String,
    default: () => uuid.v4(),
  },
  attachedToUserId: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    default: () => new Date(),
  },
  path: {
    type: String,
    default: () => {
      const date = new Date()
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    },
  },
  counterFiles: {
    type: Number,
    default: 0,
  },
})

const folderModel = model('folder', FolderSchema)

module.exports = folderModel
