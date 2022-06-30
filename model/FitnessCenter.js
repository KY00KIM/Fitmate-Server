const mongoose = require('mongoose');



const fitnessCenterSchema = mongoose.Schema(
  {
    F_ID: {
      type: Number,
      min: -2147483648,
      max: 2147483647,
      unique: true,
      primary: true,
      required: true
    },
    F_NAME: {
      type: String,
      maxlength: 200,
      required: true
    },
    F_ADDRESS: {
      type: String,
      maxlength: 200,
      required: true
    },
    F_IMG: {
      type: String,
      maxlength: 200,
      required: true
    },
    L_ID: {
      type: Number,
      min: -2147483648,
      max: 2147483647,
      ref: 'Location',
      required: true,
      reference: {
        ref: 'Location',
        localField: 'L_ID',
        foreignField: 'L_ID'
      }
    }
  })


const FitnessCenter = mongoose.model('FitnessCenter', fitnessCenterSchema);

module.exports = { FitnessCenter }