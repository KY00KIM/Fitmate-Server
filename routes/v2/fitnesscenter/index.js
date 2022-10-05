const express = require('express');
const fitnesscenterRouter = express.Router();
const fitnesscenterController = require('../../../controller/fitnesscenter');
const {verifyUser} = require("../../../middleware/auth");

fitnesscenterRouter.get('/zoom', verifyUser, fitnesscenterController.zoomFitnessCenter);

fitnesscenterRouter.get('/search',verifyUser, fitnesscenterController.searchFitnessCenter);

fitnesscenterRouter.get('/',verifyUser, fitnesscenterController.countUsersByFitnessCenter);

fitnesscenterRouter.post('/', fitnesscenterController.writeOneFitnessCenter);

fitnesscenterRouter.get('/info/:fitnesscenterId', fitnesscenterController.getOneFitnessCenterInfo);

fitnesscenterRouter.post('/info', fitnesscenterController.writeOneFitnessCenterInfo);

fitnesscenterRouter.get('/:fitnesscenterId',verifyUser, fitnesscenterController.getOneFitnessCenter);

fitnesscenterRouter.get('/users',verifyUser, fitnesscenterController.countUsersByFitnessCenter);

fitnesscenterRouter.get('/posts/unmatched',verifyUser, fitnesscenterController.countUnMatchedPostsbyFitenessCenter);

fitnesscenterRouter.get('/address',verifyUser, fitnesscenterController.getFitnessCenterByAddress);

module.exports = fitnesscenterRouter;