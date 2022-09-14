const express = require('express');
const userRouter = express.Router();
const userController = require('../../../controller/user');
const { verifyUser, customTokenController } = require("../../../middleware/auth");
const { uploadImg } = require('../../../middleware/multer');

userRouter.get('/login',verifyUser, userController.loginUserbyJWT);

userRouter.get('/',verifyUser, userController.getAllUsers);

userRouter.get('/:userId',verifyUser, userController.getOneUser);

userRouter.patch('/:userId',verifyUser, userController.updateUserInfo);

userRouter.post('/oauth/kakao', customTokenController);

userRouter.post('/oauth',verifyUser,  userController.assignUserV2);

userRouter.post('/image',verifyUser,  uploadImg('profile_image').single('image'), userController.uploadUserImg);

userRouter.delete('/',verifyUser,  userController.userSignOut);


module.exports = userRouter;