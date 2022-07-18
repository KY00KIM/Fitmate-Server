const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const { Types: { ObjectId, Double } } = mongoose.Schema;

const PushScheduleSchema = mongoose.Schema({
  pushType: {
    type: String,
    required: true
  },
  match_start_id: {
    type: ObjectId,
    ref: 'User'
  },
  match_join_id: {
    type: ObjectId,
    ref: 'User'
  },
  appointmentId: {
    type: ObjectId,
    ref: 'Appointment'
  },
  rule: {
    type: Date,
    required: true
  },
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});


const PushSchedule = mongoose.model('PushSchedule', PushScheduleSchema);

module.exports = { PushSchedule };