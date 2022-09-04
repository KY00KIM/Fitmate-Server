const express = require('express');
const pushRouter = express.Router();
const { pushChat, pushPopup, pushTest } = require('../../../controller/push');

pushRouter.post('/chat/:userId', pushChat);

pushRouter.post('/popup',pushPopup);

pushRouter.post('/test',pushTest);


module.exports = pushRouter;