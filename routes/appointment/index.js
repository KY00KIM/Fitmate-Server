const express = require('express');
const appointmentRouter = express.Router();
const appointmentController = require('../../controller/appointment');

// 약속글 조회 GET
appointmentRouter.get('/', appointmentController.getAllAppointment);

// 특정 약속글 GET
appointmentRouter.get('/:appointmentId', appointmentController.getOneAppointment);

// 약속글 등록 POST
appointmentRouter.post('/', appointmentController.writeAppointment);

module.exports = appointmentRouter; 