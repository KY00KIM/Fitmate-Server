const express = require('express');
const surveyRouter = express.Router();
const surveyController = require('../../../controller/survey');
const { verifyUser } = require("../../../middleware/auth");

surveyRouter.post('/candidates', surveyController.createSurveyCandidates);

surveyRouter.get('/candidates', surveyController.getAllSurveyCandidates);

surveyRouter.post('/', verifyUser, surveyController.updateUserSurvey);

module.exports = surveyRouter;