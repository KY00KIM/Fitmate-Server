const router = require("express").Router();
const v1Router = require('./v1');
// const v2Router = require('./v2');
const path = require('path');
const { replaceS3toCloudFront } = require('../config/aws_s3')
const { verifyUser, customTokenController } = require("..//middleware/auth");
const { UserTrace } = require('../model/UserTrace')
const { Appointment } = require('../model/Appointment')

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/landing-02-image-bg.html'));
})
router.post('/v1/users/oauth/kakao', customTokenController);
router.use('/v1', verifyUser, v1Router);
// router.use('/v2', verifyUser, v2Router);

module.exports = router