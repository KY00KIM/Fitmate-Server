const express = require('express');
const fitnesscenterRouter = express.Router();
const fitnesscenterController = require('../../../controller/fitnesscenter');


fitnesscenterRouter.get('/delete/:keyWord', fitnesscenterController.deleteFitnessCenterByKeyWord);

fitnesscenterRouter.get('/search/:keyWord', fitnesscenterController.searchFitnessCenter);

fitnesscenterRouter.get('/', fitnesscenterController.countUsersByFitnessCenter);

fitnesscenterRouter.post('/', fitnesscenterController.writeOneFitnessCenter);

fitnesscenterRouter.get('/:fitnesscenterId', fitnesscenterController.getOneFitnessCenter);

fitnesscenterRouter.get('/users', fitnesscenterController.countUsersByFitnessCenter);

fitnesscenterRouter.get('/posts/unmatched', fitnesscenterController.countUnMatchedPostsbyFitenessCenter);

fitnesscenterRouter.get('/address', fitnesscenterController.getFitnessCenterByAddress);

module.exports = fitnesscenterRouter;