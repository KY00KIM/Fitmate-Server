const express = require('express');
const fitnesscenterRouter = express.Router();
const fitnesscenterController = require('../../../controller/fitnesscenter');

fitnesscenterRouter.get('/', fitnesscenterController.getAllFitnessCenter);

fitnesscenterRouter.post('/', fitnesscenterController.writeOneFitnessCenter);

fitnesscenterRouter.get('/:fitnesscenterId', fitnesscenterController.getOneFitnessCenter);

fitnesscenterRouter.get('/users', fitnesscenterController.countAllUsersbyFitenessCenter);

fitnesscenterRouter.get('/posts/unmatched', fitnesscenterController.countUnMatchedPostsbyFitenessCenter);

fitnesscenterRouter.get('/address', fitnesscenterController.getFitnessCenterByAddress);

module.exports = fitnesscenterRouter; 