const express = require('express');
const matchRouter = express.Router();
const matchController = require('../../../controller/match');

matchRouter.post('/:appointmentId', matchController.checkMatching);
matchRouter.post('/', matchController.assignUserLocation);

module.exports = matchRouter;