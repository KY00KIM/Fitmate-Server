const express = require('express');
const userRouter = express.Router();
const userController = require('../../controller/user');

// 모든 사용자 정보 조회 GET
userRouter.get('/', userController.getAllUsers);

// 특정 사용자 정보 조회 GET
userRouter.get('/:userId', userController.getOneUser);

// 사용자의 추가 정보 등록 POST
userRouter.post('/info/:userId', userController.writeUserInfo);

// 특정 사용자 정보 변경 PATCH
userRouter.patch('/:userId', userController.updateUserInfo);

module.exports = userRouter; 