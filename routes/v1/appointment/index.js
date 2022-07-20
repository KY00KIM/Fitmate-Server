const express = require('express');
const appointmentRouter = express.Router();
const appointmentController = require('../../../controller/appointment');


appointmentRouter.get('/', appointmentController.getAllAppointment);

appointmentRouter.get('/:appointmentId', appointmentController.getOneAppointment);

appointmentRouter.post('/', appointmentController.writeAppointment);


module.exports = appointmentRouter; 