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
    default: ""
  },
  user_rating: {
    type: Number,
    default: 3
  },
  review_candidates: [{
    type: ObjectId,
    ref: 'ReviewCandidate'
  }],
  appointment_id:{
    type: ObjectId,
    ref: 'Appointment'
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review };