const express = require('express');
const pushRouter = express.Router();
const { pushChat, pushPopup } = require('../../../controller/push');

pushRouter.post('/chat/:userId', pushChat);

pushRouter.post('/popup',pushPopup)

module.exports = pushRouter;