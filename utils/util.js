const { promisify } = require('util');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const generateAccessToken = (user_id) => {
  const payload = { 
    user_id: user_id,
  };
  return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {
    algorithm: 'HS256', 
    expiresIn: '4h', 
  });
};

const generateRefreshToken = () => {
  return jwt.sign({  }, process.env.REFRESH_SECRET_KEY, {
      algorithm: 'HS256',
      expiresIn: "180 days",
  });
};

module.exports = {generateAccessToken, generateRefreshToken};