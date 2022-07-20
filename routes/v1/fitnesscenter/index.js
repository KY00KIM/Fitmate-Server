const express = require('express');
const fitnesscenterRouter = express.Router();
const fitnesscenterController = require('../../../controller/fitnesscenter');

fitnesscenterRouter.get('/', fitnesscenterController.getAllFitnessCenter);

module.exports = fitnesscenterRouter; 