const express = require('express');
const userRouter = express.Router();
const userController = require('../../../controller/user');
const { uploadImg } = require('../../../middleware/multer')

userRouter.get('/login', userController.loginUser);

userRouter.get('/', userController.getAllUsers);

userRouter.get('/:userId', userController.getOneUser);

userRouter.patch('/:userId', userController.updateUserInfo);

userRouter.post('/oauth', userController.assignUser);

userRouter.post('/image', uploadImg('profile_image').single('image'), userController.uploadUserImg);

userRouter.delete('/', userController.userSignOut);


module.exports = userRouter;