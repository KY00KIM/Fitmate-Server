const mongoose = require('mongoose');

const reviewCandidateSchema = mongoose.Schema({
  candidate_body: {
    type: String,
    required: true
  }
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});


const ReviewCandidate = mongoose.model('ReviewCandidate', reviewCandidateSchema);

module.exports = { ReviewCandidate };