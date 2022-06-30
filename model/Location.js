const mongoose = require('mongoose');


const locationSchema = mongoose.Schema(
  {
    L_ID: {
      type: Number,
      min: -2147483648,
      max: 2147483647,
      unique: true,
      primary: true,
      required: true
    },
    L_NAME: {
      type: String,
      maxlength: 200,
      required: true
    }
  })


const Location = mongoose.model('Location', locationSchema);

module.exports = { Location }
