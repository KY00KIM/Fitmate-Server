const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Types: { ObjectId } } = mongoose.Schema;


/**
 * @swagger
 * components:
 *    schemas:
 *      post:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           format: ObjectId
 *           description: references user
 *         location_id:
 *           type: string
 *           format: ObjectId
 *           description: references location
 *         post_fitness_part:
 *           type: array
 *           items:
 *             type: string
 *             format: Object_id
 *             description: references fitness part
 *         post_title:
 *           type: string
 *         post_readNo:
 *           type: integer
 *           default: 0
 *         post_hit:
 *           type: integer
 *           default: 0
 *         promise_location:
 *           type: string
 *           format: ObjectId
 *           description: references fitness center
 *         promise_date:
 *           type: string
 *           format: date
 *         post_img:
 *           type: string
 *           default: ''
 *         post_main_text:
 *           type: string
 *           default: ''
 *         is_deleted:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format : date
 *         updatedAt:
 *           type: string
 *           format : date
  */

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
    default: "https://d1cfu69a4bd45f.cloudfront.net/post_image/young-people-runner-running-on-running-road-in-city-park_41380-393.jpeg"
  },
  post_original_img:{
    type: String,
    select: false,
    default: "https://fitmate-s3-bucket.s3.ap-northeast-2.amazonaws.com/post_image/young-people-runner-running-on-running-road-in-city-park_41380-393.jpeg"
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

postSchema.plugin(mongoosePaginate);
const Post = mongoose.model('Post', postSchema);

module.exports = { Post };