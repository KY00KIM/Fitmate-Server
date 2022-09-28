const mongoose = require('mongoose');
const { Types: { Double } } = mongoose.Schema;

const locationSchema = mongoose.Schema({
  location_name: {
    type: String,
    required: true,
    unique: true
  },
  location_latitude:{
    type: Double,
    required: true
  },
  location_longitude:{
    type: Double,
    required: true
  },
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});


const Location = mongoose.model('Location', locationSchema);

module.exports = { Location };