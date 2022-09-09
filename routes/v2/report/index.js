const express = require('express');
const reportRouter = express.Router();
const reportController = require('../../../controller/report');
const { verifyUser } = require("../../../middleware/auth");

reportRouter.post('/user', reportController.reportUser);

reportRouter.post('/:postId', reportController.reportPost);

reportRouter.get('/posts', reportController.getAllPostReport);

reportRouter.get('/users', reportController.getAllUserReport);


module.exports = reportRouter; 