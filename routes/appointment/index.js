const express = require('express');
const appointmentRouter = express.Router();
const appointmentController = require('../../controller/appointment');

/**
 * @swagger
 * paths:
 *  /v1/appointments:
 *    get:
 *      summary: "약속 데이터 전체조회"
 *      description: "Get 방식으로 모든 약속 조회"
 *      tags: [Appointments]
 *      responses:
 *        "200":
 *          description: 전체 약속 정보
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
appointmentRouter.get('/', appointmentController.getAllAppointment);

/**
 * @swagger
 * paths:
 *  /v1/appointments/{appointmentId}:
 *    get:
 *      summary: "특정 약속 데이터 조회"
 *      description: "Get 방식으로 특정 약속 조회"
 *      tags: [Appointments]
 *      responses:
 *        "200":
 *          description: 특정 약속 정보
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
appointmentRouter.get('/:appointmentId', appointmentController.getOneAppointment);

/**
 * @swagger
 * paths:
 *  /v1/appointments:
 *    post:
 *      summary: "사용자 약속 등록"
 *      description: "Post 방식으로 특정 약속 등록"
 *      tags: [Appointments]
 *      responses:
 *        "200":
 *          description: 특정 약속 정보
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
appointmentRouter.post('/', appointmentController.writeAppointment);


/**
 * @swagger
 * paths:
 *  /v1/appointments/{appointmentId}:
 *    delete:
 *      summary: "사용자 약속 삭제"
 *      description: "Delete 방식으로 특정 약속 삭제"
 *      tags: [Appointments]
 *      responses:
 *        "200":
 *          description: 특정 약속 정보
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
 appointmentRouter.post('/', appointmentController.writeAppointment);

module.exports = appointmentRouter; 