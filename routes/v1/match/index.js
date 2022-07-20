const express = require('express');
const matchRouter = express.Router();
const matchController = require('../../../controller/match');

matchRouter.post('/:appointmentId', matchController.checkMatching);

module.exports = matchRouter;