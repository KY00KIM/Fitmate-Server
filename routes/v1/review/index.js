const express = require('express');
const reviewRouter = express.Router();
const reviewController = require('../../../controller/review');


reviewRouter.get('/candidates', reviewController.getReviewCandidates);

reviewRouter.post('/candidates', reviewController.writeReviewCandidate);

reviewRouter.post('/:review_send_id', reviewController.writeReview);

reviewRouter.get('/:review_recv_id', reviewController.getOneReview);

module.exports = reviewRouter;