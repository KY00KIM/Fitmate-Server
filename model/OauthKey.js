const mongoose = require('mongoose');

const oauthKeySchema = mongoose.Schema(
  {
    U_ID: {
      type: Number,
      min: -2147483648,
      max: 2147483647,
      unique: true,
      primary: true,
      ref: 'User',
      required: true,
      reference: {
        ref: 'User',
        localField: 'U_ID',
        foreignField: 'U_ID'
      }
    },
    U_TOKEN: {
      type: String,
      maxlength: 200,
      required: false
    },
    U_TOK_EXP: {
      type: Number,
      min: -2147483648,
      max: 2147483647,
      required: false
    },
    TOK_PROD: {
      type: String,
      maxlength: 200,
      required: false
    }
  })


const OauthKey = mongoose.model('User', oauthKeySchema);

module.exports = { OauthKey }

