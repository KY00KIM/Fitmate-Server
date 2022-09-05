const express = require('express');
const appointmentRouter = express.Router();
const appointmentController = require('../../../controller/appointment');
const { verifyUser } = require("../../../middleware/auth");


appointmentRouter.get('/',verifyUser, appointmentController.getAllAppointment);

appointmentRouter.get('/:appointmentId',verifyUser, appointmentController.getOneAppointment);

appointmentRouter.post('/',verifyUser, appointmentController.writeAppointment);


module.exports = appointmentRouter; 