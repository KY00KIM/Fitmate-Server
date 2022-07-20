const express = require('express');
const qrcodeRouter = express.Router();
const qrcodeController = require('../../../controller/qrcode');

qrcodeRouter.get('/:qr', qrcodeController.getUserQrcode);

qrcodeRouter.post('/:appointmentId', qrcodeController.postQRCODE);

module.exports = qrcodeRouter;