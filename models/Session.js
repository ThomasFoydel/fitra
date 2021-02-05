const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
  {
    trainer: { type: String, required: true },
    client: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, required: true },
    roomId: { type: String, required: true, select: false },
    order: { type: Object, required: true, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
