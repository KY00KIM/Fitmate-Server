const admin = require('../config/firebase-config');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const User = require("../model/User");


/**
 * @description verify firebase token in request header
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns firebase user object in req.decoded 
 */

const verifyUser = async (req, res, next) => {
    const token = req.header('Authorization')
    try {
        const decodeToken = admin.auth().verifyIdToken(token);
        //토큰이 정상 복호화된 경우
        if (decodeToken) {
            req.decoded = decodeToken
            //DB에 등록되어 있고 활성화된 유저일 경우
            if (getUserValidByToken(decodeToken))
                return next();
            //회원가입을 위한 요청일 경우
            else if (req.originalUrl === "v1/user/oauth" && req.method === "POST") {
                return next();
                //DB에 등록되지 않았고 비활성화된 유저일 경우
            } else {
                ResponseManager.getDefaultResponseHandler(res)['onError']('INVALID_JWT', STATUS_CODE.INVALID_JWT);
            }
        }
        //토큰 내용이 없을 경우
        else {
            ResponseManager.getDefaultResponseHandler(res)['onError']('EMPTY_JWT', STATUS_CODE.EMPTY_JWT);
        }
        //firebase 토큰 인증 메서드 오류
    } catch (err) {
        console.log(err)
        ResponseManager.getDefaultResponseHandler(res)['onError']('INVALID_JWT', STATUS_CODE.INVALID_JWT);
    }
}

/**
 * @description Check integrity of firebase token with UserDB
 * @param {*} Token Decoded firebase token
 * @returns Boolean whether user exists and is valid
 */
const getUserValidByToken = async (Token) => {
    const userId = Token.uid;
    const user = await User.find({ 'social.user_id': userId });
    return user && !user.is_deleted
}


module.exports = { verifyUser };
