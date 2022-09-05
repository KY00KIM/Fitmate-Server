const express = require('express');
const traceRouter = express.Router();
const traceController = require('../../../controller/trace');
const { verifyUser } = require("../../../middleware/auth");

traceRouter.post('/',verifyUser,  traceController.writeUserTrace);

module.exports = traceRouter;