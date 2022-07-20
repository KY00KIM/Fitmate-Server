const admin = require('../config/firebase-config');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const { User } = require("../model/User");


/**
 * @description verify firebase token in request header or generates customToken on request
 * @param {*} req.userID if development
 * @param {*} req.header.Authorization if production
 * @param {*} next 
 * @returns firebase user object in req.decoded & req.decoded.id
 */
const exceptions = ["/v1/api-docs", "/"]

const verifyUser = async (req, res, next) => {

    try {
        const token = req.header('Authorization')
        const decodeToken = await admin.auth().verifyIdToken(token);
        //토큰이 정상 복호화된 경우
        if (decodeToken) {
            req.user = { social: decodeToken }
            //DB에 등록되어 있고 활성화된 유저일 경우
            const user = await getUserValidByToken(decodeToken)
            if (user) {
                req.user.id = user._id;
                return next();
            } else if (req.originalUrl == "/v1/users/oauth" || req.originalUrl == "/v1/users/login") {
                //회원가입을 위한 요청일 경우
                return next();
            }
        }
        return ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorUnauthorized', STATUS_CODE.ClientErrorUnauthorized);
    } catch (error) {
        //firebase 토큰 인증 메서드 오류
        console.log(error);
        return ResponseManager.getDefaultResponseHandler(res)['onError'](error, "ClientErrorBadRequest", STATUS_CODE.ClientErrorBadRequest);
    }

}


/**
 * @description Check integrity of firebase token with UserDB
 * @param {*} Token Decoded firebase token
 * @returns Boolean whether user exists and is valid
 */
const getUserValidByToken = async (Token) => {
    const userId = Token.uid;
    const users = await User.find({ "social.user_id": userId });
    if (!users[0])
        return false
    if (users[0] && !users[0].is_deleted) return users[0]
    return false
}

/**
 * @description Check whether env is development & request to generate firebase token 
 * @param {*} url req.originalURL
 * @returns Boolean whether it is valid
 */
const checkGetTokenURL = (url) => {
    return (process.env.NODE_ENV != 'production') && url.startsWith("/v1/users/token/")
}



module.exports = { verifyUser };