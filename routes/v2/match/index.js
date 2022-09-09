const express = require('express');
const matchRouter = express.Router();
const matchController = require('../../../controller/match');
const { verifyUser } = require("../../../middleware/auth");

matchRouter.post('/:appointmentId', matchController.checkMatching);
matchRouter.post('/', matchController.assignUserLocation);

module.exports = matchRouter;