const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: String,
  end: String,
  start: String,
  startDate: Date,
  endDate: Date,
  recurring: Boolean,
  title: String,
  id: String,
});

// const rateSchema = new mongoose.Schema({
//   amount: Number,
//   currency: String,
// });

const settingSchema = new mongoose.Schema({
  rate: Number,
  currency: String,
  active: Boolean,
});

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
  displayEmail: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  profilePic: {
    type: String,
  },
  coverPic: {
    type: String,
  },
  timeZone: {
    type: String,
  },
  bio: {
    type: String,
  },
  settings: {
    type: settingSchema,
    select: false,
  },
  availability: [availabilitySchema],
  minimum: Number,
  maximum: Number,
  tags: [String],
};

module.exports = mongoose.model('Trainer', trainerSchema);
