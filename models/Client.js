const mongoose = require('mongoose');

// todo: change settings to its own schema
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
  bio: String,
};

module.exports = mongoose.model('Client', clientSchema);
