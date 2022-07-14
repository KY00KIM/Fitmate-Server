const express = require('express');
const postRouter = express.Router();
const postController = require('../../controller/post');

// 모든 모집글 조회 GET
/**
 * @swagger
 * /v1/posts:
 *   get:
 *     tags: [Posts]
 *     summary: 사용자가 작성한 모든 매칭글 목록 조회
 *     description: Response  `array of all posts` wrote by user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: authorization
 *         description: Firebase UserId Token for authenication
 *         required: true
 *         type: string
 *         format: JsonWebToken
 *       - in: body
 *         name : body
 *         required: true
 *         description : userId in NO authorization ver
 *         schema:
 *           type: object
 *           properties: 
 *             userId:
 *               type: string
 *               format : ObjectId
 *     responses:
 *       '200':
 *         description: '`SUCCESS OK`'
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             $ref: '#/definitions/post'
 *       '400':
 *         description: '`ClientErrorBadRequest`'
 * 
 */
postRouter.get('/', postController.getAllPosts);


// 특정 모집글 조회 GET
/**
 * @swagger
 * /v1/posts/{postId}:
 *   get:
 *     tags: [Posts]
 *     summary: postId로 매칭글 조회
 *     description: Returns a single post
 *     operationId: getPostById
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID of post to return
 *         required: true
 *         type: string
 *         format: ObjectId
 *     responses:
 *       '200':
 *         description: '`SUCCESS_OK`'
 *         schema:
 *           $ref: '#/definitions/post'
 *       '400':
 *         description: ClientErrorBadRequest
 */
postRouter.get('/:postId', postController.getOnePost);

// 모집글 작성 POST
/**
 * @swagger
 * /v1/posts:
 *  post:
 *     tags: [Posts]
 *     summary: 매칭글 등록
 *     description: Assign a  `post`
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
 *       - in: body
 *         name: body
 *         description: User object to be added
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user_id:
 *               type: string
 *               format: ObjectId
 *               description: references user
 *             location_id:
 *               type: string
 *               format: ObjectId
 *               description: references location
 *             post_fitness_part:
 *               type: array
 *               items:
 *                 type: string
 *                 format: Objectid
 *                 description: references fitness part
 *             post_title:
 *               type: string
 *             promise_location:
 *               type: string
 *               format: ObjectId
 *               description: references fitness center
 *             promise_date:
 *               type: string
 *               format: date
 *             post_img:
 *               type: string
 *               default: ''
 *             post_main_text:
 *               type: string
 *               default: ''
 *     responses:
 *       '200':
 *         description: '`SUCCESS OK`'
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             $ref: '#/definitions/post'
 *       '400':
 *         description: '`ClientErrorBadRequest`'
 */
postRouter.post('/', postController.writePost);

// 모집글 수정 PATCH
/**
 * @swagger
 * /v1/posts/{postId}:
 *  patch:
 *     tags: [Posts]
 *     summary: 매칭글 정보 변경
 *     description: update post information
 *     operationId: updatePost
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID of post that needs to be updated
 *         required: true
 *         type: string
 *         format: ObjectId
 *       - name: body
 *         in: body
 *         description: Updated properties of the post
 *         required: false
 *         schema:
 *           $ref: '#/definitions/post'
 *     responses:
 *       '200':
 *         description: '`SUCCESS_OK`'
 *         schema:
 *           $ref: '#/definitions/post'
 *       '400':
 *         description: ClientErrorBadRequest
 * 
 */
postRouter.patch('/:postId', postController.updatePost);

// 모집글 삭제 DELETE
/**
 * @swagger
 * /v1/posts/{postId}:
 *  delete:
 *     tags: [Posts]
 *     summary: postId로 매칭글 삭제
 *     description: Delete a post by postId
 *     operationId: deletePostById
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID of post to delete
 *         required: true
 *         type: string
 *         format: ObjectId
 *     responses:
 *       '200':
 *         description: '`SUCCESS_OK`'
 *       '400':
 *         description: ClientErrorBadRequest
 */
postRouter.delete('/:postId', postController.deletePost);


module.exports = postRouter;