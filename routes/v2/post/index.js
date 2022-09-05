const express = require('express');
const postRouter = express.Router();
const postController = require('../../../controller/post');
const { uploadImg } = require('../../../middleware/multer');
const { verifyUser } = require("../../../middleware/auth");

postRouter.get('/',verifyUser, postController.getAllPosts);

postRouter.get('/user/:userId',verifyUser, postController.getMyPost);

postRouter.post('/image/:postId',verifyUser, uploadImg('post_image').single('image'), postController.uploadPostImg);

postRouter.get('/:postId',verifyUser, postController.getOnePost);

postRouter.post('/',verifyUser, postController.writePost);

postRouter.patch('/:postId',verifyUser, postController.updatePost);

postRouter.delete('/:postId',verifyUser, postController.deletePost);

postRouter.get('/develop/test',verifyUser, postController.makeUserUrl);

module.exports = postRouter;