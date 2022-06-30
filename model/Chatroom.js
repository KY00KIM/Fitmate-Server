const mongoose = require('mongoose');




const chatroomSchema = mongoose.Schema(
  {
    R_ID: {
      type: String,
      unique: true,
      primary: true,
      required: true
    },
    R_DEL: {
      type: Boolean,
      required: true
    },
    R_CRDATE: {
      type: Date,
      format: 'date',
      required: true
    },
    R_MODDATE: {
      type: Date,
      format: 'date',
      required: true
    }
  }, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
}
)
const Chatroom = mongoose.model('Chatroom', chatroomSchema);

module.exports = { Chatroom }