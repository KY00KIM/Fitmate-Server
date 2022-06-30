const mongoose = require('mongoose');



const recruitSchema = mongoose.Schema({
  R_ID: {
    type: Number,
    min: -2147483648,
    max: 2147483647,
    unique: true,
    primary: true,
    required: true
  },
  R_TITLE: {
    type: String,
    maxlength: 200,
    required: true
  },
  R_CREAT: {
    type: Date,
    format: 'date',
    required: true
  },
  R_READ_NO: {
    type: Number,
    min: -2147483648,
    max: 2147483647,
    required: true
  },
  R_HIT: {
    type: Number,
    min: -2147483648,
    max: 2147483647,
    required: true
  },
  R_EXP: {
    type: Date,
    format: 'date',
    required: true
  },
  R_LOC: {
    type: String,
    maxlength: 200,
    required: true
  },
  R_DATE: {
    type: Date,
    format: 'date',
    required: true
  },
  R_MODATE: {
    type: Date,
    format: 'date',
    required: true
  },
  R_CRDATE: {
    type: Date,
    format: 'date',
    required: true
  },
  R_DEL: {
    type: Boolean,
    required: true
  },
  R_WRTR: {
    type: Number,
    min: -2147483648,
    max: 2147483647,
    ref: 'User',
    required: false,
    reference: {
      ref: 'User',
      localField: 'R_WRTR',
      foreignField: 'U_ID'
    }
  },
  B_ID: {
    type: Number,
    min: -2147483648,
    max: 2147483647,
    ref: 'RecruitBoard',
    required: false,
    reference: {
      ref: 'RecruitBoard',
      localField: 'B_ID',
      foreignField: 'B_ID'
    }
  },
  R_IMG: {
    type: String,
    maxlength: 200,
    required: false
  },
  R_BODY: {
    type: String,
    maxlength: 200,
    required: true
  }
})



const Recruit = mongoose.model('Recruit', recruitSchema);

module.exports = { Recruit }


