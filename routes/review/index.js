const express = require('express');
const reviewRouter = express.Router();
const reviewController = require('../../controller/review');

/**
 * @swagger
 * paths:
 *  /v1/reviews/candidates:
 *    get:
 *      summary: "리뷰 후보 요청"
 *      description: "Get 방식으로 리뷰 후보들 요청"
 *      tags: [Reviews]
 *      responses:
 *        "200":
 *          description: 리뷰 후보 요청
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
reviewRouter.get('/candidates', reviewController.getReviewCandidates);

/**
 * @swagger
 * paths:
 *  /v1/reviews/candidates:
 *    post:
 *      summary: "리뷰 후보 등록"
 *      description: "Post 방식으로 리뷰 후보 등록"
 *      tags: [Reviews]
 *      responses:
 *        "200":
 *          description: 리뷰 후보 등록
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
reviewRouter.post('/candidates', reviewController.writeReviewCandidate);

/**
 * @swagger
 * paths:
 *  /v1/reviews/{review_send_id}:
 *    post:
 *      summary: "사용자 리뷰 등록"
 *      description: "Post 방식으로 리뷰 후보 등록"
 *      tags: [Reviews]
 *      responses:
 *        "200":
 *          description: 리뷰 후보 등록
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
reviewRouter.post('/:review_send_id', reviewController.writeReview);

reviewRouter.get('/:review_recv_id', reviewController.getOneReview);

module.exports = reviewRouter;