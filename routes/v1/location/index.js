const express = require('express');
const locationRouter = express.Router();
const locationController = require('../../../controller/location');

// 모든 지역 조회
/**
 * @swagger
 * /fitnesscenters:
 *   get:
 *     summary: '모든 피트니스 센터 목록 조회'
 *     description: 'GET 방식으로 모든 피트니스센터 목록 조회'
 *     tags:
 *       - fitnesscenter
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: '`SUCCESS OK`'
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             $ref: '#/definitions/fitnessCenter'
 *       '400':
 *         description: '`ClientErrorBadRequest`'
 *
 */
locationRouter.get('/', locationController.getAllLocation);
locationRouter.get('/:locId', locationController.getOneLocation);


module.exports = locationRouter;