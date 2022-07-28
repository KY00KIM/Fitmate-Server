const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const { Types: { ObjectId } } = mongoose.Schema;

const ReportedPostSchema = mongoose.Schema({
  // 신고한 사람
  report_user: {
    type: ObjectId,
    ref: 'User'
  },
  // 신고된 매칭글
  reported_post: {
    type: ObjectId,
    ref: 'Post'
  },
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});


const ReportedPost = mongoose.model('ReportedPost', ReportedPostSchema);

module.exports = { ReportedPost };