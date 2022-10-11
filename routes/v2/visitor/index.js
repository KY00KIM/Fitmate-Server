const express = require('express');
const visitorRouter = express.Router();
const visitorController = require('../../../controller/visitor');
const chatController = require('../../../controller/chat');
visitorRouter.get('/posts', visitorController.getPosts);

visitorRouter.get('/fitnesscenter', visitorController.getFitnessCenter);

visitorRouter.get('/test', visitorController.doTest);

module.exports = visitorRouter;