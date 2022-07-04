const admin = require('../config/firebase-config');
const STATUS_CODE = require(path.join(__dirname, 'config/http_status_code'));
const jwt = require("jsonwebtoken");
const path = require("path");
const ResponseManager = require(path.join(__dirname, 'config/response'));

const { User } = require('../models/User');

// let auth = (req, res, next) => {
//     let token = req.cookies.w_auth;

//     User.findByToken(token, (err, user) => {
//         if (err) throw err;
//         if (!user)
//             return res.json({
//                 isAuth: false,
//                 error: true
//             });

//         req.token = token;
//         req.user = user;
//         next();
//     });
// };

const auth = async (req, res, next) => {
    const token = req.body.access_token;
    try {
        const decodeToken = admin.auth().verifyIdToken(token);
        if (decodeToken) {
            return next();
        }
        else {
            return res.json({ code: STATUS_CODE.EMPTY_JWT, message: "Empty token" });
        }
    } catch (err) {
        return res.json({ code: STATUS_CODE.INVALID_JWT, message: "Token validation error occured" });
    }
}

/**
 * 
 * @param {headers: {authorization : "Bearer <JWT>"}} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */


const verifyToken = (req, res, next) => {
    try {
        const token = req.headers['authorization']
        console.log(token)

        req.decoded = jwt.verify(token, jwt_secret);
        return next();
    } catch (error) {
        if (token == null) return res.status(401).json({
            code: 401,
            message: "EMPTY TOKEN"
        });
        if (error.name == 'TokenExpiredError') {
            return ResponseManager.getDefaultResponseHandler(res)['onError']({});

            return res.status(402).json({
                code: 402,
                message: "Token Out of date Expiration"
            })
        }
        console.log(error)
        return res.status(401).json({
            code: 401,
            message: 'Unvalid token',
        });
    }
};



const generateBothToken = (user) => {
    /*
    logic required for redundancy check with db
    */
    const refresh_token = jwt.sign(user, process.env.jwt_secret, { issuer: `FitMate Authenication Server` })
    const access_token = generateExpiaryToken(user, '24h')

    return {
        access_token: access_token,
        refresh_token: refresh_token
    }

}

const generateAccessToken = (user, refresh_token) => {
    /*
    logic required for refresh_token validation check with db
    */
    return generateExpiaryToken(user, '24h');
}


/*
기능 : access token 발행
params : 
    user : object that represents user to be signed
    time : string for expiary time 
        e.g.) "60s" "60m" "24h" "7d" 
*/
const generateExpiaryToken = (obj, time) => {
    return jwt.sign(obj, PROCESS.ENV.JWT_SECRET, {
        expiresIn: `${time}`,
        issuer: `FitMate Authenication Server`
    })
}




module.exports = { auth };
