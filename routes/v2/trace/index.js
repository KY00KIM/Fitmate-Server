const express = require('express');
const traceRouter = express.Router();
const traceController = require('../../../controller/trace');
const { verifyUser } = require("../../../middleware/auth");

traceRouter.post('/noauth', traceController.writeUserTraceNoAuth);

traceRouter.post('/', verifyUser, traceController.writeUserTrace);

traceRouter.post('/certificate', verifyUser, traceController.certificateUserTrace);

module.exports = traceRouter;