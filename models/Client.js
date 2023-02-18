const mongoose = require('mongoose')

const clientSchema = {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  settings: {
    type: Object,
    select: false,
  },
  displayEmail: String,
  profilePic: String,
  coverPic: String,
  timeZone: String,
  bio: String,
}

module.exports = mongoose.model('Client', clientSchema)
