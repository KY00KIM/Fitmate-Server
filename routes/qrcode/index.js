const express = require('express');
const qrcodeRouter = express.Router();
const qrcodeController = require('../../controller/qrcode');

/**
 * @swagger
 * paths:
 *  /v1/qrcode/:
 *    get:
 *      summary: "샤용자의 qrcode 생성"
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
 qrcodeRouter.get('/:qr', qrcodeController.getUserQrcode);



module.exports = qrcodeRouter;