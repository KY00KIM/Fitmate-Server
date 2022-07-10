const express = require('express');
const reviewRouter = express.Router();
const reviewController = require('../../controller/review');

// Review 후보 조회 GET
reviewRouter.get('/candidates', reviewController.getReviewCandidates);

// Review 후보 등록 POST
reviewRouter.post('/candidates', reviewController.writeReviewCandidate);

// Review 등록 POST
reviewRouter.post('/:review_send_id', reviewController.writeReview);

module.exports = reviewRouter;