const admin = require('../config/firebase-config');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const { User } = require("../model/User");


/**
 * @description verify firebase token in request header
 * @param {*} req.userID if development
 * @param {*} req.header.Authorization if production
 * @param {*} next 
 * @returns firebase user object in req.decoded & req.decoded.id
 */

const verifyUser = async (req, res, next) => {
    //PRODUCTION AUTHENICATION
    if (process.env.NODE_ENV == 'production') {
        try {
            const token = req.header('Authorization')
            const decodeToken = admin.auth().verifyIdToken(token);
            //토큰이 정상 복호화된 경우
            if (decodeToken) {
                req.decoded = decodeToken
                //DB에 등록되어 있고 활성화된 유저일 경우
                const user = getUserValidByToken(decodeToken)
                if (user) {
                    req.decoded.id = user.id;
                    return next();
                }
                //회원가입을 위한 요청일 경우
                else if (req.originalUrl === "v1/user/oauth" && req.method === "POST") {
                    return next();
                    //DB에 등록되지 않았고 비활성화된 유저일 경우
                } else {
                    ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorUnauthorized', STATUS_CODE.ClientErrorUnauthorized);
                }
            }
            //토큰 내용이 없을 경우
            else {
                ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorUnauthorized', STATUS_CODE.ClientErrorUnauthorized);
            }
            //firebase 토큰 인증 메서드 오류
        } catch (err) {
            console.log(err);
            ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    } else {
        //DEVELOPMENT LEVEL
        const id = req.header("user_id")
        if (id) {
            const user = await User.findById(id);
            if (!user) ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
            req.decoded = {
                id: id
            }
            next();
        } else {
            ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorUnauthorized', STATUS_CODE.ClientErrorUnauthorized);
        }
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
    if (user && !user.is_deleted) return user
    return false
}


module.exports = { verifyUser };