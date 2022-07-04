const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const { Types: { ObjectId, Double } } = mongoose.Schema;


const userSchema = mongoose.Schema({

  user_name: String,
  user_pwd: String,
  user_email: String,
  user_address: String,
  user_nickname: {
    type: String,
    required: true
  },
  user_profile_img: String,
  user_background_img: String,
  user_introduce: String,
  user_fitness_part: [{
    type: ObjectId,
    ref: 'FitnessPart'
  }],
  user_age: {
    type: Number,
    min: 1,
    max: 200
  },
  user_gender: {
    type: Boolean,
    required: true
  },
  user_loc_bound: Number,
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
    user_token: String,
    user_token_exp: Number,
    token_provider: String,
  }
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});

const User = mongoose.model('User', userSchema);

module.exports = { User }


