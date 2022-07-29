const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const { Types: { ObjectId, Double } } = mongoose.Schema;

const ReportedUserSchema = mongoose.Schema({
  report_user: {
    type: ObjectId,
    ref: 'User'
  },
  reported_user: [{
    type: ObjectId,
    ref: 'User'
  }],
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});


const ReportedUser = mongoose.model('ReportedUser', ReportedUserSchema);

module.exports = { ReportedUser };