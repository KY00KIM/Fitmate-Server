const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const { Types: { ObjectId, Double } } = mongoose.Schema;
const { User } = require('./User')
const { Appointment } = require('./Appointment')
const timeConvert = require('../config/timeConvert')
const matchController = require('../controller/match')


const userTraceSchema = mongoose.Schema({
  user_id: {
    type: ObjectId,
    ref: 'User',
  },
  user_longitude: {
    type: Double,
    default: 0.0,
  },
  user_latitude: {
    type: Double,
    default: 0.0,
  },
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});

const UserTrace = mongoose.model('UserTrace', userTraceSchema);


UserTrace.watch().
  on('change', async (data) => {
    const trace = await UserTrace.findById(data.documentKey)
    //UPDATE USER LON, LAT FROM TRACE
    const user = await User.findByIdAndUpdate(trace.user_id, {
      user_latitude: trace.user_latitude,
      user_longitude: trace.user_longitude
    })

    //get appointments within 10min & check Matching
    const curTime = new Date().getTime()
    const appointments = await Appointment.find({
      $or: [{ 'match_start_id': trace.user_id }, { 'match_join_id': trace.user_id }],
      appointment_date: { $gte: curTime - 600000, $lte: curTime + 600000 }
    });
    const appointment = appointments[0]
    if (appointments[0]) {
      const distance = matchController.getDistanceBetweenUsersInKm(appointment.match_start_id, appointment.match_join_id)
      if (distance <= 1) {
        //MATCH SUCCEED
        await Appointment.findByIdAndUpdate(appointment._id, { match_succeeded: true });
      }
    }
  });

module.exports = { UserTrace };


