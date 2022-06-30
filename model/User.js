const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
  U_ID: {
    type: Number,
    min: -2147483648,
    max: 2147483647,
    unique: true,
    primary: true,
    required: true
  },
  U_NAME: {
    type: String,
    maxlength: 200,
    required: true
  },
  U_PWD: {
    type: String,
    maxlength: 200,
    required: true
  },
  U_EMAIL: {
    type: String,
    maxlength: 200,
    required: true
  },
  U_LOC: {
    type: Number,
    min: -2147483648,
    max: 2147483647,
    ref: 'Location',
    required: true,
    reference: {
      ref: 'Location',
      localField: 'U_LOC',
      foreignField: 'L_ID'
    }
  },
  U_ADDR: {
    type: String,
    maxlength: 200,
    required: true
  },
  U_NICKNAME: {
    type: String,
    maxlength: 200,
    required: true
  },
  U_PROFILE_IMG: {
    type: String,
    maxlength: 200,
    required: true
  },
  U_INTRODUCE: {
    type: String,
    maxlength: 200,
    required: true
  },
  U_AGE: {
    type: Number,
    min: -2147483648,
    max: 2147483647,
    required: true
  },
  U_GENDER: {
    type: Boolean,
    required: true
  },
  U_LBOUND: {
    type: Number,
    min: -2147483648,
    max: 2147483647,
    required: true
  }
})

const User = mongoose.model('User', userSchema);

module.exports = { User }


