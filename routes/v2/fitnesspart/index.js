const express = require('express');
const fitnesspartRouter = express.Router();
const fitnesspartController = require('../../../controller/fitnesspart');
const { verifyUser } = require("../../../middleware/auth");

fitnesspartRouter.get('/',verifyUser, fitnesspartController.getAllFitnessPart);

fitnesspartRouter.post('/',verifyUser, fitnesspartController.writeFitnessPart);

module.exports = fitnesspartRouter; 