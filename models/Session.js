const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sessionSchema = new Schema(
  {
    roomId: { type: String, required: true, select: false },
    order: { type: Object, required: true, select: false },
    trainer: { type: String, required: true },
    startTime: { type: Date, required: true },
    client: { type: String, required: true },
    status: { type: String, required: true },
    endTime: { type: Date, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Session', sessionSchema)
