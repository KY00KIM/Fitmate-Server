const express = require('express');
const fitnesspartRouter = express.Router();
const fitnesspartController = require('../../controller/fitnesspart');

// 모든 운동 부위 조회 GET
fitnesspartRouter.get('/', fitnesspartController.getAllFitnessPart);

// 운동 부위 등록 POST
fitnesspartRouter.post('/', fitnesspartController.writeFitnessPart);

module.exports = fitnesspartRouter; 