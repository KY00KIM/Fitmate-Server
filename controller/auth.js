const admin = require('../config/firebase-config');
const { STATUS_CODE } = require('../config/http_status_code')

//const { User } = require('../models/User');

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



module.exports = { auth };
