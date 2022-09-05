const express = require('express');
const userRouter = express.Router();
const userController = require('../../../controller/user');
const { customTokenController } = require("../../../middleware/auth");
const { uploadImg } = require('../../../middleware/multer');

userRouter.get('/login', userController.loginUserbyJWT);

userRouter.get('/', userController.getAllUsers);

userRouter.get('/:userId', userController.getOneUser);

userRouter.patch('/:userId', userController.updateUserInfo);

userRouter.post('/oauth/kakao', customTokenController);


userRouter.post('/oauth', userController.assignUser);

// userRouter.post('/signup', userController.assignUser);

userRouter.post('/image', uploadImg('profile_image').single('image'), userController.uploadUserImg);

userRouter.delete('/', userController.userSignOut);


module.exports = userRouter;