const mongoose = require('mongoose');
const { Types: { ObjectId } } = mongoose.Schema;

const appointmentSchema = mongoose.Schema({
  center_id: {
    type: ObjectId,
    ref: 'FitnessCenter'
  },
  appointment_location: {
    type: String,
  },
  appointment_date: {
    type: Date,
  },
  match_start_id: {
    type: ObjectId,
    ref: 'User'
  },
  match_join_id: {
    type: ObjectId,
    ref: 'User'
  },
  match_succeeded:{
    type: Boolean,
    default: false
  }
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});


const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = { Appointment };

