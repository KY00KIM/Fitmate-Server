const express = require('express');
const reviewRouter = express.Router();
const reviewController = require('../../../controller/review');


reviewRouter.get('/candidates', reviewController.getReviewCandidates);

reviewRouter.post('/candidates', reviewController.writeReviewCandidate);

<<<<<<< HEAD
reviewRouter.post('/', reviewController.writeReview);
=======
>>>>>>> develop

reviewRouter.get('/:review_recv_id', reviewController.getOneReview);

reviewRouter.post('/', reviewController.writeReview);

module.exports = reviewRouter;