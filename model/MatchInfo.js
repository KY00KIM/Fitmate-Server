const mongoose = require('mongoose');

const matchInfoSchema = mongoose.Schema(
  {
    M_CRDATE: {
      type: Date,
      format: 'date',
      unique: true,
      primary: true,
      required: true
    },
    M_DEL: {
      type: Boolean,
      required: true
    },
    M_MODATE: {
      type: Date,
      format: 'date',
      required: true
    },
    M_START_ID: {
      type: Number,
      min: -2147483648,
      max: 2147483647,
      ref: 'User',
      required: false,
      reference: {
        ref: 'User',
        localField: 'M_START_ID',
        foreignField: 'U_ID'
      }
    },
    M_JOIN_ID: {
      type: Number,
      min: -2147483648,
      max: 2147483647,
      ref: 'User',
      required: false,
      reference: {
        ref: 'User',
        localField: 'M_JOIN_ID',
        foreignField: 'U_ID'
      }
    }
  })


const MatchInfo = mongoose.model('MatchInfo', matchInfoSchema);

module.exports = { MatchInfo }