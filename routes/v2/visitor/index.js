const express = require('express');
const visitorRouter = express.Router();
const visitorController = require('../../../controller/user');
const { uploadImg } = require('../../../middleware/multer');

visitorRouter.get('/login', visitorController.loginUserbyJWT);

visitorRouter.get('/', visitorController.getAllUsers);

visitorRouter.get('/:userId', visitorController.getOneUser);

visitorRouter.patch('/:userId', visitorController.updateUserInfo);

visitorRouter.post('/oauth/kakao', visitorController);

visitorRouter.post('/oauth', visitorController.assignUser);

visitorRouter.post('/image', uploadImg('profile_image').single('image'), userController.uploadUserImg);

visitorRouter.delete('/', visitorController.userSignOut);


module.exports = visitorRouter;