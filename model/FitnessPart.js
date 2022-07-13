const mongoose = require('mongoose');

const fitnessPartSchema = mongoose.Schema({
  fitness_name: {
    type: String,
    required: true
  }
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});


const FitnessPart = mongoose.model('FitnessPart', fitnessPartSchema);

module.exports = {FitnessPart};