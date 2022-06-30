const mongoose = require('mongoose');



const chatMsgSchema = mongoose.Schema(
  {
    M_ID: {
      type: Number,
      min: -2147483648,
      max: 2147483647,
      unique: true,
      primary: true,
      required: true
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
    },
    MSG: {
      type: String,
      maxlength: 200,
      required: true
    },
    M_TIME: {
      type: Date,
      format: 'date',
      required: true
    },
    U_ID: {
      type: Number,
      min: -2147483648,
      max: 2147483647,
      ref: 'User',
      required: false,
      reference: {
        ref: 'User',
        localField: 'U_ID',
        foreignField: 'U_ID'
      }
    }
  }, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
})

const ChatMsg = mongoose.model('', chatMsgSchema);

module.exports = { ChatMsg }