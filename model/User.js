const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const { Types: { ObjectId, Double } } = mongoose.Schema;


const userSchema = mongoose.Schema({

  user_name: String,
  user_pwd: {
    type: String,
    select: false
  },
  user_email: String,
  // 데이터 파싱 필요
  user_address: String,
  user_nickname: {
    type: String,
    required: true
  },
  user_profile_img: String,
  // 운동 스케줄
  user_schedule_time: {

  },
  user_weekday:{

  },
  user_introduce: String,
  user_fitness_part: [{
    type: ObjectId,
    ref: 'FitnessPart'
  }],
  // 확인 필요
  user_age: {
    type: Number,
    min: 1,
    max: 200
  },
  user_gender: {
    type: Boolean,
    required: true
  },
  user_loc_bound:{
    type: Number,
    default: 3
  } ,
  fitness_center_id: {
    type: ObjectId,
    ref: 'FitnessCenter'
  },
  user_longitude: Double,
  user_latitude: Double,
  location_id: {
    type: ObjectId,
    ref: 'Location'
  },
  social: {
    user_id: String,
    user_name: String,
    provider: String,
    device_token: String,
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


