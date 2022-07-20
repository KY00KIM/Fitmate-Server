const express = require('express');
const postRouter = express.Router();
const postController = require('../../../controller/post');

postRouter.get('/', postController.getAllPosts);


postRouter.get('/:postId', postController.getOnePost);

postRouter.post('/', postController.writePost);

postRouter.patch('/:postId', postController.updatePost);

postRouter.delete('/:postId', postController.deletePost);


module.exports = postRouter;