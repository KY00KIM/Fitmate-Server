const router = require("express").Router();
const v1Router = require('./v1');
const v2Router = require('./v2');
const glob = require('glob')
const path = require('path');

const { verifyUser, customTokenController, publicLanding } = require("../middleware/auth");
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
router.get('/logs', async (req, res) => {
    try {

        await glob(`config/logs/info/*.log`, function (err, files) {
            if (err) {
                console.log(err);
            }

            console.log("files: ", files);

            files.forEach(file => {
                console.log("file: ",file);
            });
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](files, 'SuccessOK', STATUS_CODE.SuccessOK);
        });

    } catch (error) {
        console.log(error)
        ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ServerErrorInternal', STATUS_CODE.ServerErrorInternal);
    };
});
router.get('/logs/today', async (req, res) => {
    try {

        await glob(`config/logs/info/2022-${req.query.month}-${req.query.date}.log`, function (err, files) {
            if (err) {
                console.log(err);
            }
            console.log("files: ", files);

            files.forEach(file => {
                console.log("file: ",file);
            });
            res.sendFile(path.join(__dirname , '../',`config/logs/info/2022-${req.query.month}-${req.query.date}.log`))
        });

    } catch (error) {
        console.log(error)
        ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ServerErrorInternal', STATUS_CODE.ServerErrorInternal);
    };
});
router.post('/v1/users/oauth/kakao', customTokenController);
router.use('/v2', v2Router);
router.use('/v1', verifyUser, v1Router);

module.exports = router