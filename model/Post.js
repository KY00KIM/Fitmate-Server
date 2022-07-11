const mongoose = require('mongoose');
const { Types: { ObjectId } } = mongoose.Schema;



const postSchema = mongoose.Schema({
  user_id: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  location_id: {
    type: ObjectId,
    ref: 'Location',
    required: true
  },
  post_fitness_part: [{
    type: ObjectId,
    ref: 'FitnessPart'
  }],
  post_title: {
    type: String,
    required: true
  },
  post_readNo: {
    type: Number,
    required: true,
    default: 0
  },
  post_hit: {
    type: Number,
    required: true,
    default: 0
  },
  is_deleted: {
    type: Boolean,
    required: true,
    default: false
  },
  promise_location: {
    type: ObjectId,
    ref: 'FitnessCenter',
  },
  promise_date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  post_img: {
    type: String,
    default: ""
  },
  post_main_text: {
    type: String,
    default: ""
  }

}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});


const Post = mongoose.model('Post', postSchema);

module.exports = { Post };