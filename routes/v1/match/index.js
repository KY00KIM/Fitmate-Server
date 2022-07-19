const express = require('express');
const matchRouter = express.Router();
const matchController = require('../../../controller/match');

// 특정 약속에 대한 매칭 체크 POST
/**
 * 
 * @swagger
 * 
 * /v1/matching/{appointmentId}:
 *   post:
 *     tags: [Matching]
 *     summary: 매칭 여부 확인 및 등록
 *     description: Check a  `matching` whether users are within 1km and save result to Appointment
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         description: appointmentId for appointment to check
 *         required: true
 *         type: string
 *         format: ObjectId
 *       - in: header
 *         name: authorization
 *         description: Firebase UserId Token for authenication
 *         required: true
 *         type: string
 *         format: JsonWebToken
 *       - in: body
 *         name: body
 *         description: Appointment User properties to be checked
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user_1:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                   format: ObjectId
 *                 user_longitutde:
 *                   type: number
 *                   description: double in degrees
 *                 user_latitude:
 *                   type: number
 *                   description: double in degrees
 *             user_2:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                   format: ObjectId
 *                 user_longitutde:
 *                   type: number
 *                   description: double in degrees
 *                 user_latitude:
 *                   type: number
 *                   description: double in degrees
 *     responses:
 *       '200':
 *         description: '`SUCCESS OK`'
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             $ref: '#/definitions/appointment'
 *       '400':
 *         description: '`ClientErrorBadRequest`'
 * 
 */
matchRouter.post('/:appointmentId', matchController.checkMatching);

module.exports = matchRouter;