const express = require('express');
const pushRouter = express.Router();
const { pushChat, pushPopup, pushTest, getUserPush, deletePush } = require('../../../controller/push');
const { verifyUser } = require("../../../middleware/auth");

pushRouter.get('/', getUserPush);

pushRouter.delete('/:pushId', deletePush);

pushRouter.post('/chat/:userId', pushChat);

pushRouter.post('/popup', pushPopup);

pushRouter.post('/test', pushTest);


module.exports = pushRouter;