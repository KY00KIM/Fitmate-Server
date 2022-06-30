const mongoose = require('mongoose');



const workoutSchema = mongoose.Schema(
  {
    R_ID: {
      type: Number,
      min: -2147483648,
      max: 2147483647,
      unique: true,
      primary: true,
      ref: 'Recruit',
      required: true,
      reference: {
        ref: 'Recruit',
        localField: 'R_ID',
        foreignField: 'R_ID'
      }
    },
    W_ID: {
      type: Number,
      min: -2147483648,
      max: 2147483647,
      unique: true,
      primary: true,
      ref: 'FitnessPart',
      required: true,
      reference: {
        ref: 'FitnessPart',
        localField: 'W_ID',
        foreignField: 'W_ID'
      }
    }
  })


const Workout = mongoose.model('Workout', workoutSchema);

module.exports = { Workout }

