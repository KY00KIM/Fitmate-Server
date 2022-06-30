const mongoose = require('mongoose');


const reviewSchema = mongoose.Schema({
  M_CRDATE: {
    type: Date,
    format: 'date',
    unique: true,
    primary: true,
    ref: 'MatchInfo',
    required: true,
    reference: {
      ref: 'MatchInfo',
      localField: 'M_CRDATE',
      foreignField: 'M_CRDATE'
    }
  },
  R_DEL: {
    type: Boolean,
    required: true
  },
  R_MODATE: {
    type: Date,
    format: 'date',
    required: true
  },
  R_SEND_ID: {
    type: Number,
    min: -2147483648,
    max: 2147483647,
    ref: 'User',
    required: false,
    reference: {
      ref: 'User',
      localField: 'R_SEND_ID',
      foreignField: 'U_ID'
    }
  },
  R_RECV_ID: {
    type: Number,
    min: -2147483648,
    max: 2147483647,
    ref: 'User',
    required: false,
    reference: {
      ref: 'User',
      localField: 'R_RECV_ID',
      foreignField: 'U_ID'
    }
  },
  R_BODY: {
    type: String,
    maxlength: 200,
    required: true
  }
})


const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review }
