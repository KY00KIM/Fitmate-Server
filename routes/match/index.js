const express = require('express');
const matchRouter = express.Router();
const matchController = require('../../controller/match');

// 특정 약속에 대한 매칭 체크 POST
matchRouter.post('/:appointmentId', matchController.checkMatching);

module.exports = matchRouter;