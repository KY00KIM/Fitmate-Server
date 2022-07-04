const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
  location_name: {
    type: String,
    required: true
  }
}, {
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true }
});


const Location = mongoose.model('Location', locationSchema);

module.exports = { Location }

