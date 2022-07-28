const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const { Types: { ObjectId, Double } } = mongoose.Schema;

const ReportedChatsSchema = mongoose.Schema({
  report_user: {
    type: ObjectId,
    ref: 'User'
  },
  reported_user: {
    type: ObjectId,
    ref: 'User'
  },
  // chat_content: {
  //   type: String,
  // },
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});


const ReportedChats = mongoose.model('ReportedChats', ReportedChatsSchema);

module.exports = { ReportedChats };