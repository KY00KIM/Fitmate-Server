const express = require('express');
const reviewRouter = express.Router();
const reviewController = require('../../../controller/review');
const { verifyUser } = require("../../../middleware/auth");


reviewRouter.get('/candidates',verifyUser, reviewController.getReviewCandidates);

reviewRouter.post('/candidates',verifyUser, reviewController.writeReviewCandidate);

reviewRouter.post('/', verifyUser,reviewController.writeReview);

reviewRouter.get('/:review_recv_id',verifyUser, reviewController.getOneReview);

reviewRouter.delete('/:review_id',verifyUser, reviewController.deleteOneReview);

module.exports = reviewRouter;