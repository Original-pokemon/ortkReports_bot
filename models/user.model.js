const { Schema, model } = require('mongoose')
const uuid = require('uuid')

const UserSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    default: () => uuid.v4(),
  },
  telegramId: {
    type: Number,
    required: true,
  },
  telegramName: {
    type: String,
    required: true,
  },
  userGroup: {
    type: String,
    required: true,
    default: 'user',
  },
  registerDate: {
    type: Number,
    default: () => new Date(),
  },
})

const userModel = model('user', UserSchema)

module.exports = userModel
