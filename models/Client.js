const mongoose = require('mongoose');

const clientSchema = {
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
  settings: {
    type: Object,
    select: false,
  },
};

module.exports = mongoose.model('Client', clientSchema);
