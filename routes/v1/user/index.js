const express = require('express');
const userRouter = express.Router();
const userController = require('../../../controller/user');
const { verifyUser } = require("../../../middleware/auth");
const { uploadImg } = require('../../../middleware/multer');

userRouter.get('/login',verifyUser, userController.loginUser);

userRouter.get('/', userController.getAllUsers);

userRouter.get('/:userId', userController.getOneUser);

userRouter.patch('/:userId', userController.updateUserInfo);

userRouter.post('/oauth/refresh', userController.assignUser);

userRouter.post('/oauth', userController.assignUser);

// userRouter.post('/signup', userController.assignUser);

userRouter.post('/image', uploadImg('profile_image').single('image'), userController.uploadUserImg);

userRouter.delete('/', userController.userSignOut);


module.exports = userRouter;