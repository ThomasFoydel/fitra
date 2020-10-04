const mongoose = require('mongoose');

const trainerSchema = {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
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
    type: Object,
    select: false,
  },
};

// needs: weekly schedule
module.exports = mongoose.model('Trainer', trainerSchema);
