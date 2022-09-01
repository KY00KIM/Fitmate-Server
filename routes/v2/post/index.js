const express = require('express');
const postRouter = express.Router();
const postController = require('../../../controller/post');

postRouter.get('/', postController.getAllPostsWithNoLogin);

module.exports = postRouter;