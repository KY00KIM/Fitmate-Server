const express = require('express');
const reportRouter = express.Router();
const reportController = require('../../../controller/report');

reportRouter.post('/post/:postId', reportController.reportPost);

reportRouter.post('/chatting', reportController.reportChatting);

module.exports = reportRouter; 