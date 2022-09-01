const router = require("express").Router();
const v1Router = require('./v1');
const v2Router = require('./v2');
const path = require('path');
const { replaceS3toCloudFront } = require('../config/aws_s3')
const { verifyUser } = require("..//middleware/auth");
const { UserTrace } = require('../model/UserTrace')
const { Appointment } = require('../model/Appointment')

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/landing-02-image-bg.html'));
});
router.get('/manifest.plist', (req, res) => {
    res.setHeader("Content-Type", 'text/plain');
    res.sendFile(__dirname + "/../ipa/manifest.plist");
});
router.get('/fitamte.ipa', (req, res) => {
    res.setHeader("Content-Type", 'application/png');
    res.sendFile(__dirname + "/../ipa/fitmate.ipa");
});
router.use('/v2',v2Router);
router.use('/v1', verifyUser, v1Router);

module.exports = router