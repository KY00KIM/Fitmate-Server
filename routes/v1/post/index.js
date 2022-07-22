const express = require('express');
const postRouter = express.Router();
const postController = require('../../../controller/post');
const { uploadImg } = require('../../../middleware/multer')


postRouter.get('/', postController.getAllPosts);

postRouter.post('/image/:postId', uploadImg('post_image').single('image'), postController.uploadPostImg)

postRouter.get('/:postId', postController.getOnePost);

postRouter.post('/', postController.writePost);

postRouter.patch('/:postId', postController.updatePost);

postRouter.delete('/:postId', postController.deletePost);


module.exports = postRouter;