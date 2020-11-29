const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    trainer: { type: String, required: true },
    client: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    appointment: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
