const express = require('express');
const locationRouter = express.Router();
const locationController = require('../../controller/location');

// 모든 지역 조회
locationRouter.get('/', locationController.getAllLocation);

module.exports = locationRouter;