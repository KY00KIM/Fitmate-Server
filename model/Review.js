const mongoose = require('mongoose');
const { Types: { ObjectId } } = mongoose.Schema;



const reviewSchema = mongoose.Schema({
  review_send_id: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  review_recv_id: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  review_body: {
    type: String
  }
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
})


const User = mongoose.model('Review', reviewSchema);

module.exports = { Review }