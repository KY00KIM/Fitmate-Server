const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const { Types: { ObjectId, Double } } = mongoose.Schema;



/**
 * @swagger
 * components:
 *  schemas:
 *   user:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *         format: ObjectId
 *       user_name:
 *         type: string
 *       user_address:
 *         type: string
 *         format: formatted address
 *       user_nickname:
 *         type: string
 *         description: ''
 *       user_email:
 *         type: string
 *       user_profile_img:
 *         type: string
 *       user_schedule_time:
 *         type: integer
 *         description: '0 : 오전, 1 : 오후, 2 : 저녁'
 *       user_weekday:
 *         type: object
 *         default: false
 *         properties:
 *           mon:
 *             type: boolean
 *           tue:
 *             type: boolean
 *           wed:
 *             type: boolean
 *           thu:
 *             type: boolean
 *           fri:
 *             type: boolean
 *           sat:
 *             type: boolean
 *           sun:
 *             type: boolean
 *       user_introduce:
 *         type: string
 *       user_fitness_part:
 *         type: array
 *         items:
 *           type: string
 *           format: ObjectId
 *       user_age:
 *         type: integer
 *       user_gender:
 *         type: boolean
 *       user_loc_bound:
 *         type: integer
 *         default: 3
 *       fitness_center_id:
 *         type: string
 *         format: ObjectId
 *         description: references FitnessCenter
 *       user_longitude:
 *         type: number
 *         description: double in degrees
 *       user_latitude:
 *         type: number
 *         description: double in degrees
 *       location_id:
 *         type: string
 *         format: ObjectId
 *         description: references Location
 *       social:
 *         type: object
 *         properties:
 *           user_id:
 *             type: string
 *             description: firebase user id
 *           user_name:
 *             type: string
 *             description: firebase user name
 *           provider:
 *             type: string
 *             description: firebase token provider
 *           device_token:
 *             type: string
 *             description: firebase user token
 *           firebase_info:
 *             type: object
 *             description: firebase additional info
 *       is_deleted:
 *         type: boolean
 *         default: false
 *       createdAt:
 *         type: string
 *         format : date
 *       updatedAt:
 *         type: string
 *         format : date
  */



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
    type: Number
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


