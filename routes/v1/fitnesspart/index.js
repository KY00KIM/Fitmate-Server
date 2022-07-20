const express = require('express');
const fitnesspartRouter = express.Router();
const fitnesspartController = require('../../../controller/fitnesspart');

fitnesspartRouter.get('/', fitnesspartController.getAllFitnessPart);

fitnesspartRouter.post('/', fitnesspartController.writeFitnessPart);

module.exports = fitnesspartRouter; 