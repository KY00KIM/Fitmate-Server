const express = require('express');
const fitnesscenterRouter = express.Router();
const fitnesscenterController = require('../../../controller/fitnesscenter');
const { uploadImg } = require('../../../middleware/multer')

fitnesscenterRouter.get('/login', fitnesscenterController.countAllUsersbyFitenessCenter);

fitnesscenterRouter.get('/', fitnesscenterController.getAllFitnessCenter);

module.exports = fitnesscenterRouter;