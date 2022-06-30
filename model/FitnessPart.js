const mongoose = require('mongoose');



const fitnessPartSchema = mongoose.Schema(
  {
    W_ID: {
      type: Number,
      min: -2147483648,
      max: 2147483647,
      unique: true,
      primary: true,
      required: true
    },
    W_NAME: {
      type: String,
      maxlength: 200,
      required: true
    }
  })


const FitnessPart = mongoose.model('FitnessPart', fitnessPartSchema);

module.exports = { FitnessPart }
