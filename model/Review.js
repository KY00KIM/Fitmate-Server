const mongoose = require('mongoose');
const { Types: { ObjectId } } = mongoose.Schema;

/**
 * @swagger
 * components:
 *  schemas:
 *    review:
 *      type: object
 *      properties: 
 *        review_send_id : 
 *          type: string
 *          format : ObjectId
 *        review_recv_id: 
 *          type: string
 *          format : ObjectId
 *        review_body: 
 *           type: string,
 *           default: ""
 *        user_rating: 
 *           type: Number
 *           default: 3
 *        review_candidate:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *        createdAt:
 *            type: string
 *            format : date
 *        updatedAt:
 *            type: string
 *            format : date
  */

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