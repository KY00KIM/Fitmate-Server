const express = require('express');
const locationRouter = express.Router();
const locationController = require('../../../controller/location');

locationRouter.get('/', locationController.getAllLocation);

module.exports = locationRouter;