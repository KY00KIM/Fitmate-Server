const admin = require('../config/firebase-config');
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken} = require('../utils/util');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const { User } = require("../model/User");
require("dotenv").config();

const exceptions = ["/v1/api-docs", "/"];

const verifyToken = (req, res, next) => {
    try {
      req.decoded = jwt.verify(req.header('Authorization').split(' ')[1], process.env.JWT_SECRET);
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') { // 유효기간 초과
        return ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'TokenExpiredError', STATUS_CODE.ClientErrorUnauthorized);
      }
      return ResponseManager.getDefaultResponseHandler(res)['onError'](error, '유효하지 않은 토큰입니다', STATUS_CODE.ClientErrorUnauthorized);
    }
  };
const checkTokens = async (req, res, next) =>{
    	/**
         * access token 자체가 없는 경우엔 에러(401)를 반환
         * 클라이언트측에선 401을 응답받으면 로그인 페이지로 이동시킴
         */
        if (req.cookies.access === undefined) throw Error('API 사용 권한이 없습니다.'); 
        
        const accessToken = verifyToken(req.cookies.access);
        const refreshToken = verifyToken(req.cookies.refresh); // *실제로는 DB 조회
        if (accessToken === null) {
            if (refreshToken === undefined) { // case1: access token과 refresh token 모두가 만료된 경우
                throw Error('API 사용 권한이 없습니다.');
            } else { // case2: access token은 만료됐지만, refresh token은 유효한 경우
                /**
                 *  DB를 조회해서 payload에 담을 값들을 가져오는 로직
                 */
                const newAccessToken = generateAccessToken(user_id);
                res.header('Authorization', newAccessToken);
                req.header.Authorization = newAccessToken;
                next();
            }
        } else {
            if (refreshToken === undefined) { // case3: access token은 유효하지만, refresh token은 만료된 경우

                /**
                 * DB에 새로 발급된 refresh token 삽입하는 로직 (login과 유사)
                 */
                const newRefreshToken = generateAccessToken();
                res.body('refresh', newRefreshToken);
                req.body.refresh = newRefreshToken;
                next();
            } else { // case4: accesss token과 refresh token 모두가 유효한 경우
                next();
            }
        }
};
const verifyUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        const decodeToken = await admin.auth().verifyIdToken(token);
        //토큰이 정상 복호화된 경우
        if (decodeToken) {
            req.user = { social: decodeToken };
            //DB에 등록되어 있고 활성화된 유저일 경우
            const user = await getUserValidByToken(decodeToken);
            if (user) {
                req.user.id = user._id;
                return next();
            } else{
                //회원가입을 위한 요청일 경우
                const user = await User.create();
                req.user.id = user._id;
                return next();
            };
        }
        return ResponseManager.getDefaultResponseHandler(res)['onError']('','VerifyUserError Or Auth Error', STATUS_CODE.ClientErrorUnauthorized);
    } catch (error) {
        //firebase 토큰 인증 메서드 오류
        console.log(error);
        ResponseManager.getDefaultResponseHandler(res)['onError'](error, "ClientErrorBadRequest", STATUS_CODE.ClientErrorBadRequest);
    }

};



/**
 * @description Check integrity of firebase token with UserDB
 * @param {*} Token Decoded firebase token
 * @returns Boolean whether user exists and is valid
 */
const getUserValidByToken = async (Token) => {
    const userId = Token.uid || Token.user_id;
    const users = await User.find({ "social.user_id": userId });
    if (!users[0])
        return false;
    if (users[0] && !users[0].is_deleted) 
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



module.exports = { verifyUser };