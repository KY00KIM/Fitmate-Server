const express = require('express');
const reviewRouter = express.Router();
const reviewController = require('../../../controller/review');
const { verifyUser } = require("../../../middleware/auth");


reviewRouter.get('/candidates', reviewController.getReviewCandidates);

reviewRouter.post('/candidates', reviewController.writeReviewCandidate);

reviewRouter.get('/fitnesscenter/candidates', reviewController.getFitnessCenterReviewCandidates);

reviewRouter.post('/fitnesscenter/candidates', reviewController.writeFitnessCenterReviewCandidates);

reviewRouter.get('/fitnesscenter/average/:fitnesscenterId', reviewController.getAverageFitnessCenterReview);

reviewRouter.get('/fitnesscenter/:fitnesscenterId', reviewController.getFitnessCenterReviewByUser);

reviewRouter.post('/fitnesscenter/:fitnesscenterId', reviewController.writeFitnessCenterReview);

reviewRouter.post('/',reviewController.writeReview);

reviewRouter.get('/:review_recv_id', reviewController.getOneReview);

reviewRouter.delete('/:review_id', reviewController.deleteOneReview);

module.exports = reviewRouter;