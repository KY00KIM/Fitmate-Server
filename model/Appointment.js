const mongoose = require('mongoose');
const { Types: { ObjectId } } = mongoose.Schema;

/**
 * @swagger
 * components:
 *    schemas:
 *      appointment:
 *        type: object
 *        properties:
 *          center_id:
 *            type: string
 *            format: ObjectId
 *            description: references FitnessCenter
 *          appointment_location:
 *            type: string
 *          appointment_date:
 *            type: string
 *            format: date
 *          match_start_id:
 *            type: string
 *            format: ObjectId
 *            description: references User
 *          match_join_id:
 *            type: string
 *            format: ObjectId
 *            description: references User
 *          match_succeeded:
 *            type: boolean
 *            default: false
 *          createdAt:
 *            type: string
 *            format : date
 *          updatedAt:
 *            type: string
 *            format : date
*/


const appointmentSchema = mongoose.Schema({
  // center_id: {
  //   type: ObjectId,
  //   ref: 'FitnessCenter'
  // },
  // appointment_location: {
  //   type: String,
  // },
  appointment_date: {
    type: Date,
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
  match_succeeded: {
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

