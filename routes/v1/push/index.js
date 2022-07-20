const express = require('express');
const pushRouter = express.Router();
const { pushChat } = require('../../../controller/push');

pushRouter.post('/chat/:userId', pushChat);

module.exports = pushRouter;