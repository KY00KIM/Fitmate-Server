const express = require('express');
const visitorRouter = express.Router();
const visitorController = require('../../../controller/visitor');

visitorRouter.get('/posts', visitorController.getPosts);

visitorRouter.get('/fitnesscenter', visitorController.getFitnessCenter);


module.exports = visitorRouter;