const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
require('mongoose-double')(mongoose);
const { Types: { ObjectId, Double } } = mongoose.Schema;


const fitnessCenterSchema = mongoose.Schema({
  center_name: {
    type: String,
    required: true,
  },
  center_address: String,
  // center_img: [{
  //   type: String,
  // }],
  center_location: {
    type: ObjectId,
    ref: 'Location',
    required: true
  },
  fitness_longitude: {
    type: Double
  },
  fitness_latitude: {
    type: Double
  },
  kakao_url: {
    type: String,
    default: ""
  }
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});

fitnessCenterSchema.plugin(aggregatePaginate);
fitnessCenterSchema.plugin(mongoosePaginate);
fitnessCenterSchema.index({ center_name : 'text'});
const FitnessCenter = mongoose.model('FitnessCenter', fitnessCenterSchema);

module.exports = { FitnessCenter };