const mongoose = require('mongoose');


const recruitBoardSchema = mongoose.Schema(
  {
    B_ID: {
      type: Number,
      min: -2147483648,
      max: 2147483647,
      unique: true,
      primary: true,
      required: true
    },
    B_LOC: {
      type: Number,
      min: -2147483648,
      max: 2147483647,
      ref: 'Location',
      required: true,
      reference: {
        ref: 'Location',
        localField: 'B_LOC',
        foreignField: 'L_ID'
      }
    }
  })

const RecruitBoard = mongoose.model('RecruitBoard', recruitBoardSchema);

module.exports = { RecruitBoard }

