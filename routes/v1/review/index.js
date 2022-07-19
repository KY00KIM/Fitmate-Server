const express = require('express');
const reviewRouter = express.Router();
const reviewController = require('../../../controller/review');

/**
 * @swagger
 * paths:
 *  /v1/reviews/candidates:
 *    get:
 *      summary: "리뷰 후보 데이터 전체조회"
 *      description: "GET 방식으로 리뷰 후보 등록"
 *      tags: [Reviews]
 *      responses:
 *        "200":
 *          description: 전체 리뷰 후보 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    success:
 *                      type: boolean
 *                    message:
 *                      type: string
 *                    data:
 *                      type: object
 *                      example:
 *                          [
 *                            { "_id": "62c66ef64b8212e4674dbe20", "candidate_body": "매너가 좋아요.", "id": "62c66ef64b8212e4674dbe20" },
 *                            { "_id": "62c66f0b4b8212e4674dbe21", "candidate_body": "약속을 잘 지켜요.", "id": "62c66f0b4b8212e4674dbe21"},
 *                            { "_id": "62c66f224b8212e4674dbe22", "candidate_body": "열정적이에요.", "id": "62c66f224b8212e4674dbe22"},
 *                          ]
 */
reviewRouter.get('/candidates', reviewController.getReviewCandidates);

/**
 * @swagger
 *
 * /v1/reviews/candidates:
 *  post:
 *    summary: "리뷰 후보 등록"
 *    description: "POST 방식으로 리뷰 후보 등록"
 *    tags: [Reviews]
 *    requestBody:
 *      description: POST 방식으로 리뷰 후보 등록합니다.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              candidate_body:
 *                type: string
 *                description: "리뷰 후보"
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

/**
 * @swagger
 * paths:
 *  /v1/reviews/{review_recv_id}:
 *    get:
 *      summary: "특정 사용자의 리뷰를 조회"
 *      description: "GET 방식으로 특정 사용자의 리뷰 조회"
 *      tags: [Reviews]
 *      parameters:
 *      - in: path
 *        name: review_recv_id
 *        required: true
 *        description: 유저 아이디
 *        schema:
 *          type: string
 *      responses:
 *        "200":
 *          description: 특정 사용자의 리뷰를 조회
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    success:
 *                      type: boolean
 *                    message:
 *                      type: string
 *                    data:
 *                      type: object
 *                      example:
 *                          [
 *                              {
 *                                  "_id": "62ca84c9c28e02f330956341",
 *                                  "review_send_id": {
 *                                      "social": {
 *                                          "user_id": "gtx1080",
 *                                          "user_name": "Kyumin Kim",
 *                                          "provider": "google"
 *                                          },
 *                                      "is_deleted": false,
 *                                      "_id": "62c6697a4b8212e4674dbe14",
 *                                      "user_name": "김규민 버전2",
 *                                      "user_email": "kyumin@gmail.com",
 *                                      "user_address": "서울특별시 영등포구 국제금융로 5길 54",
 *                                      "user_nickname": "잠자고싶은사람",
 *                                      "user_profile_img": "https://i1.sndcdn.com/artworks-000280219757-ls2h99-t500x500.jpg",
 *                                      "user_background_img": [],
 *                                      "user_introduce": "안녕하세요 잠많은 사람입니다.",
 *                                      "user_fitness_part": [
 *                                         "62c670404b8212e4674dbe33",
 *                                          "62c670514b8212e4674dbe34",
 *                                          "62c6705e4b8212e4674dbe35"
 *                                              ],
 *                                      "user_age": 24,
 *                                      "user_gender": true,
 *                                      "user_loc_bound": 5,
 *                                      "user_longitude": 126.938754,
 *                                      "user_latitude": 37.520817,
 *                                      "location_id": "62c66fbf4b8212e4674dbe2a",
 *                                      "createdAt": "2022-07-10T08:12:13.830Z",
 *                                      "updatedAt": "2022-07-10T17:49:05.691Z",
 *                                      "user_weekday": {
 *                                          "sat": true
 *                                              },
 *                                       "id": "62c6697a4b8212e4674dbe14"
 *                                  },
 *                                  "review_recv_id": "62c6699c4b8212e4674dbe15",
 *                                  "review_candidate": [
 *                                      "62c66ead4b8212e4674dbe1f",
 *                                      "62c66ef64b8212e4674dbe20"
 *                                                      ],
 *                                  "createdAt": "2022-07-10T07:50:33.321Z",
 *                                  "updatedAt": "2022-07-10T07:50:33.321Z",    
 *                                  "id": "62ca84c9c28e02f330956341"
 *                              },                 
 *                          ]
 */
reviewRouter.get('/:review_recv_id', reviewController.getOneReview);

module.exports = reviewRouter;