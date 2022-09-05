const express = require('express');
const qrcodeRouter = express.Router();
const qrcodeController = require('../../../controller/qrcode');
const { verifyUser } = require("../../../middleware/auth");

qrcodeRouter.get('/:qr',verifyUser, qrcodeController.getUserQrcode);

qrcodeRouter.post('/:appointmentId',verifyUser, qrcodeController.postQRCODE);

module.exports = qrcodeRouter;