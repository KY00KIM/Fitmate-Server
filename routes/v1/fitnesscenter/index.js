const express = require('express');
const fitnesscenterRouter = express.Router();
const fitnesscenterController = require('../../../controller/fitnesscenter');

fitnesscenterRouter.get('/', fitnesscenterController.getAllFitnessCenter);
fitnesscenterRouter.get('/:fitnesscenterId', fitnesscenterController.getOneFitnessCenter);
fitnesscenterRouter.get('/', fitnesscenterController.writeOneFitnessCenter);


module.exports = fitnesscenterRouter; 