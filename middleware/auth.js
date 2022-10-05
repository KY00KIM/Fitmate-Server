const admin = require('../config/firebase-config');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, verifyAccessToken } = require('../utils/util');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const { User } = require("../model/User");
require("dotenv").config();

const exceptions = ["/v1/api-docs", "/"];

const publicLanding = async (req, res, next) => {
    res.setHeader(
        "Content-Security-Policy-Report-Only",
        "default-src 'self';\n" +
        "script-src 'report-sample' 'self';\n" +
        "style-src 'report-sample' 'self';\n" +
        "object-src 'none';\n" +
        "base-uri 'self';\n" +
        "connect-src 'self';\n" +
        "font-src 'self';\n" +
        "frame-src 'self';\n" +
        "img-src 'self';\n" +
        "manifest-src 'self';\n" +
        "media-src 'self';\n" +
        "report-uri https://6327de1d61f1dae92c2ae104.endpoint.csper.io/?v=2;\n" +
        "worker-src 'none';")
    return next();
};

const verifyUser = async (req, res, next) => {

    try {
        const token = req.header('Authorization').split(' ')[1];
        const decodeToken = await admin.auth().verifyIdToken(token);
        //토큰이 정상 복호화된 경우
        if (decodeToken) {
            req.user = { social: decodeToken }
            //DB에 등록되어 있고 활성화된 유저일 경우
            console.log(decodeToken);
            const user = await getUserValidByToken(decodeToken)
            if (user) {
                req.user.id = user['_id'];
                if (req.user.id == undefined) req.user._id = user['_id'].toString();
                return next();
            } else if (req.originalUrl == "/v1/users/oauth" || "/v2/users/oauth" || req.originalUrl == "/v1/users/login" || "/v2/users/login" || req.originalUrl == "/v1/users/oauth/kakao") {
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

};


/**
 * @description Check integrity of firebase token with UserDB
 * @param {*} Token Decoded firebase token
 * @returns Boolean whether user exists and is valid
 */
const getUserValidByToken = async (Token) => {
    const userId = Token.uid || Token.user_id;
    const users = await User.find({ $and:[{"social.user_id": userId}, {is_deleted: false}] });
    if (!users[0])
        return false;
    if (users[0] && !users[0]['is_deleted'])
        return users[0];
    return false;
};

/**
 * @description Check whether env is development & request to generate firebase token 
 * @param {*} url req.originalURL
 * @returns Boolean whether it is valid
 */
const checkGetTokenURL = (url) => {
    return (process.env.NODE_ENV != 'production') && url.startsWith("/v1/users/token/")
};

const customTokenController = async (req, res) => {
    const user = req.body;
    const uid = `kakao:${user.uid}`;
    const updateParams = {
        email: user.email,
        photoURL: user.photoURL,
        displayName: user.displayName,
    };

    try {
        await admin.auth().updateUser(uid, updateParams);
    } catch (error) {
        updateParams["uid"] = uid;

        console.log("error from Firebase update : " + error);
        try {
            await admin.auth().createUser(updateParams);
        } catch (error) {
            console.log("error from Firebase create : " + error)
            return ResponseManager.getDefaultResponseHandler(res)['onError'](error, "ClientErrorBadRequest", STATUS_CODE.ClientErrorBadRequest);

        };
    }

    const token = await admin.auth().createCustomToken(uid);
    console.log("Custom Token : " + token);
    return ResponseManager.getDefaultResponseHandler(res)['onSuccess']({ custom_token: token }, "SuccessOK", STATUS_CODE.SuccessOK);

}


module.exports = { verifyUser, customTokenController };