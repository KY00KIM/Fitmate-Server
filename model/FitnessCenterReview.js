const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const { Types: { ObjectId, Double } } = mongoose.Schema;


const fitnessCenterReviewSchema = mongoose.Schema({
    center_id: {
        type: ObjectId,
        ref: 'FitnessCenter',
        required: true
    },
    review_send_id: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    center_rating:{
        type: Number,
        default: 3
    },
    center_review:{
        type: String,
    },
    center_review_by_select: [{
        type: ObjectId,
        ref: 'FitnessCenterReviewCandidate',
        required: true
    }],
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true }
});


const FitnessCenterReview = mongoose.model('FitnessCenterReview', fitnessCenterReviewSchema);

module.exports = { FitnessCenterReview };