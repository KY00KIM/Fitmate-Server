const express = require('express');
const reportRouter = express.Router();
const reportController = require('../../../controller/report');
const { verifyUser } = require("../../../middleware/auth");

reportRouter.post('/user',verifyUser, reportController.reportUser);

reportRouter.post('/:postId',verifyUser, reportController.reportPost);

reportRouter.get('/posts',verifyUser, reportController.getAllPostReport);

reportRouter.get('/users',verifyUser, reportController.getAllUserReport);


module.exports = reportRouter; 