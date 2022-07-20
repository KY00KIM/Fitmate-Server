const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const { Types: { ObjectId, Double } } = mongoose.Schema;




const userSchema = mongoose.Schema({

  user_name: String,
  user_pwd: {
    type: String,
    select: false,
    default: ""
  },
  user_email: String,
  // 데이터 파싱 필요
  user_address: String,
  user_nickname: {
    type: String,
    required: true
  },
  user_profile_img: String,
  // 운동 스케줄 (0 : 아침, 1 : 오후, 2 : 저녁)
  user_schedule_time: Number,
  user_weekday: {
    mon: { type: Boolean, default: false },
    tue: { type: Boolean, default: false },
    wed: { type: Boolean, default: false },
    thu: { type: Boolean, default: false },
    fri: { type: Boolean, default: false },
    sat: { type: Boolean, default: false },
    sun: { type: Boolean, default: false }
  },
  user_introduce: String,
  user_fitness_part: [{
    type: ObjectId,
    ref: 'FitnessPart'
  }],
  // 확인 필요
  user_age: {
    type: Number,
    default: 0
  },
  user_gender: {
    type: Boolean,
    required: true
  },
  user_loc_bound: {
    type: Number,
    default: 3
  },
  fitness_center_id: {
    type: ObjectId,
    ref: 'FitnessCenter',

  },
  user_longitude: Double,
  user_latitude: Double,
  location_id: {
    type: ObjectId,
    ref: 'Location',
  },
  social: {
    user_id: String,
    user_name: String,
    provider: String,
    device_token: [String],
    firebase_info: Object,
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };


