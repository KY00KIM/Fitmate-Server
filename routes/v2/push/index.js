const express = require('express');
const pushRouter = express.Router();
const { pushChat, pushPopup, pushTest } = require('../../../controller/push');
const { verifyUser } = require("../../../middleware/auth");

pushRouter.post('/chat/:userId',verifyUser, pushChat);

pushRouter.post('/popup',verifyUser, pushPopup);

pushRouter.post('/test',verifyUser, pushTest);


module.exports = pushRouter;