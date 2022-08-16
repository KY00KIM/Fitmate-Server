const express = require('express');
const traceRouter = express.Router();
const traceController = require('../../../controller/trace');

traceRouter.post('/', traceController.writeUserTrace);

module.exports = traceRouter;