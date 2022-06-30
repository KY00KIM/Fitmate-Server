const mongoose = require('mongoose');



const followerSchema = mongoose.Schema(
  {
    FER_CRDATE: {
      type: Date,
      format: 'date',
      unique: true,
      primary: true,
      required: true
    },
    FER_DEL: {
      type: Boolean,
      required: true
    },
    FER_MODATE: {
      type: Date,
      format: 'date',
      required: true
    },
    FER_ID: {
      type: Number,
      min: -2147483648,
      max: 2147483647,
      ref: 'User',
      required: false,
      reference: {
        ref: 'User',
        localField: 'FER_ID',
        foreignField: 'U_ID'
      }
    },
    FING_ID: {
      type: Number,
      min: -2147483648,
      max: 2147483647,
      ref: 'User',
      required: false,
      reference: {
        ref: 'User',
        localField: 'FING_ID',
        foreignField: 'U_ID'
      }
    }
  })



const Follower = mongoose.model('Follower', followerSchema);

module.exports = { Follower }