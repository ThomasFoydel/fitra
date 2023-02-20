const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
  {
    authorName: { type: String, required: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    content: { type: String, required: true },
    participants: { type: Array, required: true },
    fromTrainer: { type: Boolean, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Message', messageSchema)
