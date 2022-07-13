const express = require('express');
const pushRouter = express.Router();
const {pushChat} = require('../../controller/push');
/**
 * @swagger
 * paths:
 *  /v1/push/chat/{userId}:
 *    post:
 *      summary: "채팅 답변 알림 푸시"
 *      description: "Post 방식으로 특정 사용자의 채팅 답변 알림 푸시"
 *      tags: [Push]
 *      responses:
 *        "200":
 *          description: 특정 사용자의 채팅 답변 알림 푸시
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    ok:
 *                      type: boolean
 *                    users:
 *                      type: object
 *                      example:
 *                          [
 *                            { "id": 1, "name": "유저1" },
 *                            { "id": 2, "name": "유저2" },
 *                            { "id": 3, "name": "유저3" },
 *                          ]
 */
pushRouter.post('/chat/:userId', pushChat);

module.exports = pushRouter;