const express = require('express');
const fitnesscenterRouter = express.Router();
const fitnesscenterController = require('../../../controller/fitnesscenter');

// 모든 운동 센터 조회 GET
fitnesscenterRouter.get('/', fitnesscenterController.getAllFitnessCenter);

module.exports = fitnesscenterRouter; 