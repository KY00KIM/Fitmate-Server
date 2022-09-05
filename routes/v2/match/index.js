const express = require('express');
const matchRouter = express.Router();
const matchController = require('../../../controller/match');
const { verifyUser } = require("../../../middleware/auth");

matchRouter.post('/:appointmentId',verifyUser, matchController.checkMatching);
matchRouter.post('/',verifyUser, matchController.assignUserLocation);

module.exports = matchRouter;