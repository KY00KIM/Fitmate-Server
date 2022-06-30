const mongoose = require('mongoose');




const chatroomInfoSchema = mongoose.Schema(
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
    R_ID: {
      type: String,
      unique: true,
      primary: true,
      ref: 'Chatroom',
      required: true,
      reference: {
        ref: 'Chatroom',
        localField: 'R_ID',
        foreignField: 'R_ID'
      }
    }
  }, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
})

const ChatroomInfo = mongoose.model('ChatroomInfo', chatroomInfoSchema);

module.exports = { ChatroomInfo }