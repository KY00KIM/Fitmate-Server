const express = require('express');
const postRouter = express.Router();
const postController = require('../../../controller/post');
const { uploadImg } = require('../../../middleware/multer');
const { verifyUser } = require("../../../middleware/auth");

// postRouter.get('/test', postController);

postRouter.get('/', postController.getAllPostsV2);

postRouter.get('/user/:userId', postController.getMyPost);

postRouter.post('/image/:postId', uploadImg('post_image').single('image'), postController.uploadPostImg);

postRouter.get('/:postId', postController.getOnePost);

postRouter.post('/', postController.writePostV2);

postRouter.patch('/:postId', postController.updatePost);

postRouter.delete('/:postId', postController.deletePost);

module.exports = postRouter;