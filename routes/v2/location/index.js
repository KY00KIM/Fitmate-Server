const express = require('express');
const locationRouter = express.Router();
const locationController = require('../../../controller/location');

const { verifyUser } = require("../../../middleware/auth");
locationRouter.get('/',verifyUser, locationController.getAllLocation);
locationRouter.get('/:locId',verifyUser, locationController.getOneLocation);


module.exports = locationRouter;