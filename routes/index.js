const router = require("express").Router();
const v1Router = require('./v1');
const v2Router = require('./v2');
const path = require('path');
const { replaceS3toCloudFront } = require('../config/aws_s3');
const { verifyUser, customTokenController, publicLanding } = require("../middleware/auth");
const { UserTrace } = require('../model/UserTrace');
const { Appointment } = require('../model/Appointment');
const { User } = require('../model/User');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');

router.get('/',(req, res) => {
    res.sendFile(path.join(__dirname, '../public/landing-02-image-bg.html'));
});

router.get('/users/valid/:nickname', async (req, res) => {
    const { nickname } = req.params;
    var result;
    let newnickname = decodeURIComponent(nickname);
    console.log("decoded : " + newnickname)
    try {
        const user = await User.findOne({ user_nickname: newnickname, is_deleted: false });
        result = user == null
        ResponseManager.getDefaultResponseHandler(res)['onSuccess']({ result: result }, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
        console.log(error)
        ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ServerErrorInternal', STATUS_CODE.ServerErrorInternal);
    };
});
router.post('/v1/users/oauth/kakao', customTokenController);
router.use('/v2', v2Router);
router.use('/v1', verifyUser, v1Router);

module.exports = router