const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const { Types: { ObjectId, Double } } = mongoose.Schema;

const fitnessCenterSchema = mongoose.Schema({
  center_name: {
    type: String,
    required: true
  },
  center_address: String,
  center_img: [{
    type:String,
  }],
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
  }
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});


const FitnessCenter = mongoose.model('FitnessCenter', fitnessCenterSchema);

module.exports = { FitnessCenter };