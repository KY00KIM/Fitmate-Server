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
    type: String,
    required: true
  },
  user_rating: {
    type: Number,
    required: true
  }
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review };