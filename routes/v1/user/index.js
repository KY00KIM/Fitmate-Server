const express = require('express');
const userRouter = express.Router();
const userController = require('../../../controller/user');

/**
 * @swagger
 * 
 * /v1/users/token/{uid}:
 *   get:
 *     tags: [Users]
 *     summary: firebase uid 해당하는 token 발급
 *     description: firebase uid에 해당하는 `인증토큰`를 반환합니다.
 *     parameters:
 *       - in: header
 *         name: authorization
 *         description: Firebase UserId Token for authenication
 *         required: true
 *         type: string
 *         format: JsonWebToken
 *     responses:
 *       '200':
 *         description: '`SUCCESS OK`'
 *         schema:
 *             data: 
 *              type: string
 *              format: Json Web Token
 *       '401':
 *         description: '`ClientErrorUnauthorized`'
 */

/**
 * @swagger
 * 
 * /v1/users/login:
 *   get:
 *     tags: [Users]
 *     summary: 모든 유저 목록 조회
 *     description: 인증 토큰에 해당하는 `user_id`를 반환합니다.
 *     parameters:
 *       - in: header
 *         name: authorization
 *         description: Firebase UserId Token for authenication
 *         required: true
 *         type: string
 *         format: JsonWebToken
 *     responses:
 *       '200':
 *         description: '`SUCCESS OK`'
 *         schema:
 *             $ref: '#/components/schemas/user'
 *       '400':
 *         description: '`ClientErrorBadRequest`'
 */
userRouter.get('/login', userController.checkUserValid);



// 모든 사용자 정보 조회 GET
/**
 * @swagger
 * 
 * /v1/users:
 *   get:
 *     tags: [Users]
 *     summary: 모든 유저 목록 조회
 *     description: Response  `array of all user`
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: authorization
 *         description: Firebase UserId Token for authenication
 *         required: true
 *         type: string
 *         format: JsonWebToken
 *     responses:
 *       '200':
 *         description: '`SUCCESS OK`'
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/user'
 *       '400':
 *         description: '`ClientErrorBadRequest`'
 */
userRouter.get('/', userController.getAllUsers);

// 특정 사용자 정보 조회 GET
/**
 * @swagger
 * 
 * /v1/users/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: userID로 사용자 조회
 *     description: Returns a single user
 *     operationId: getUserById
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of user to return
 *         required: true
 *         type: string
 *         format: ObjectId
 *     responses:
 *       '200':
 *         description: '`SUCCESS_OK`'
 *         schema:
 *           $ref: '#/definitions/user'
 *       '400':
 *         description: ClientErrorBadRequest
 */
userRouter.get('/:userId', userController.getOneUser);


// 특정 사용자 정보 변경 PATCH
/**
 * @swagger
 * 
 * /v1/users/{userId}:
 *  patch:
 *     tags: [Users]
 *     summary: 사용자 정보 변경
 *     description: update user information
 *     operationId: updateUser
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of user that needs to be updated
 *         required: true
 *         type: string
 *         format: ObjectId
 *       - name: body
 *         in: body
 *         description: Updated name of the pet
 *         required: false
 *         schema:
 *           $ref: '#/definitions/user'
 *     responses:
 *       '200':
 *         description: '`SUCCESS_OK`'
 *         schema:
 *           $ref: '#/definitions/user'
 *       '400':
 *         description: ClientErrorBadRequest
 */
userRouter.patch('/:userId', userController.updateUserInfo);

// 새로운 사용자 등록 POST
/**
 * @swagger
 * /v1/users/oauth:
 *   post:
 *     tags: [Users]
 *     summary: 새로운 유저 등록
 *     description: Add new user to db with firebase token
 *     operationId: assignUser
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: authorization
 *         description: Firebase UserId Token for authenication and user info
 *         required: true
 *         type: string
 *         format: JsonWebToken
 *       - in: body
 *         name: body
 *         description: User object to be added        from name ~ firebase is firebase token info, when no authorization
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user_nickname:
 *               type: string
 *             user_address:
 *               type: string
 *               format: formatted address
 *             user_schedule_time:
 *               type: integer
 *               description: '0 : 오전, 1 : 오후, 2 : 저녁'
 *             user_weekday:
 *               type: object
 *               default: false
 *               properties:
 *                 mon:
 *                   type: boolean
 *                 tue:
 *                   type: boolean
 *                 wed:
 *                   type: boolean
 *                 thu:
 *                   type: boolean
 *                 fri:
 *                   type: boolean
 *                 sat:
 *                   type: boolean
 *                 sun:
 *                   type: boolean
 *             user_gender:
 *               type: boolean
 *               format: 'true : male, false : female'
 *             user_longitude:
 *               type: number
 *               description: double in degrees
 *             user_latitude:
 *               type: number
 *               description: double in degrees
 *             fitness_center:
 *               type: object
 *               properties:
 *                 center_name: 
 *                   type: string
 *                 center_address: 
 *                   type: string 
 *                 fitness_longitude:
 *                   type: string 
 *                 fitness_latitude: 
 *                   type: string 
 *             name: 
 *               type: string
 *             email:
 *               type : string
 *               format: email
 *             picture:
 *               type: string
 *             uid:
 *               type: string
 *             firebase:
 *               type: object
 *               properties:
 *                 sign_in_provider:
 *                   type: string
 *             
 *     responses:
 *       '201':
 *         description: '`SUCCESS CREATED` returns created user document'
 *         schema:
 *           $ref: '#/components/schemas/user'
 *       '400':
 *         description: '`Client Bad Request`'
 * 
 *
 */
userRouter.post('/oauth', userController.assignUser);

module.exports = userRouter;
