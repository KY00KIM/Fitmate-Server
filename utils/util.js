const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const ResponseManager = require("../config/response");
const STATUS_CODE = require("../config/http_status_code");
require("dotenv").config();

const generateAccessToken = (user_id) => {
  const payload = { 
    user_id: user_id,
  };
  return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {
      expiresIn: '4h',
      issuer : "FitMate"
  });
};

const generateRefreshToken = () => {
  return jwt.sign({  }, process.env.REFRESH_SECRET_KEY, {
      expiresIn: "30 days",
      issuer : "FitMate"
  });
};
const verifyAccessToken = (tok) => { // access token 검증
    let decoded = null;
    try {
        decoded = jwt.decode(tok,  process.env.ACCESS_SECRET_KEY);
        return {
            ok: true,
            user_id: decoded.user_id
        };
    } catch (err) {
        return {
            ok: false,
            message: err.message,
        };
    }
};
const refreshAccessToken = (user_id) => {

};
module.exports = {generateAccessToken, generateRefreshToken, verifyAccessToken, refreshAccessToken};