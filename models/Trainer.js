const mongoose = require('mongoose')

const availabilitySchema = new mongoose.Schema({
  id: String,
  day: String,
  end: String,
  endDate: Date,
  title: String,
  start: String,
  startDate: Date,
  recurring: Boolean,
})

const settingSchema = new mongoose.Schema({
  rate: Number,
  active: Boolean,
  currency: String,
})

const trainerSchema = {
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
    type: settingSchema,
    select: false,
  },
  availability: [availabilitySchema],
  displayEmail: String,
  profilePic: String,
  coverPic: String,
  timeZone: String,
  minimum: Number,
  maximum: Number,
  tags: [String],
  bio: String,
}

module.exports = mongoose.model('Trainer', trainerSchema)
