const express = require('express');
const reviewRouter = express.Router();
const reviewController = require('../../controller/review');

// Review 후보 GET
reviewRouter.get('/candidates', reviewController.getReviewCandidates);

// Review 등록 POST
reviewRouter.post('/:review_send_id', reviewController.writeReview);

module.exports = reviewRouter;