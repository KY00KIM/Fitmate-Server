const express = require('express');
const appointmentRouter = express.Router();
const appointmentController = require('../../../controller/appointment');
const { verifyUser } = require("../../../middleware/auth");


appointmentRouter.get('/', appointmentController.getAllAppointment);

appointmentRouter.get('/calendar', appointmentController.calendarAppointment);

appointmentRouter.get('/:appointmentId', appointmentController.getOneAppointment);

appointmentRouter.post('/', appointmentController.writeAppointment);

appointmentRouter.delete('/:appointmentId', appointmentController.deleteAppointment);


module.exports = appointmentRouter; 