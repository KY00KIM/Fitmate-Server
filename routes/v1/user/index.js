const express = require('express');
const userRouter = express.Router();
const userController = require('../../../controller/user');

userRouter.get('/login', userController.checkUserValid);

userRouter.get('/', userController.getAllUsers);

userRouter.get('/:userId', userController.getOneUser);

userRouter.patch('/:userId', userController.updateUserInfo);

userRouter.post('/oauth', userController.assignUser);

module.exports = userRouter;
