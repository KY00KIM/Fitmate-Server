const mongoose = require('mongoose');

const FitnessCenterReviewCandidateSchema = mongoose.Schema({
    candidate_body: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true }
});


const FitnessCenterReviewCandidate = mongoose.model('FitnessCenterReviewCandidate', FitnessCenterReviewCandidateSchema);

module.exports = { FitnessCenterReviewCandidate };