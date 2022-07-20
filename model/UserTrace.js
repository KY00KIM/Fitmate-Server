const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const { Types: { ObjectId, Double } } = mongoose.Schema;


const userTraceSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: 'User',
      },
    user_longitude: Double,
    user_latitude: Double,
  }, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true }
  });
  
  const UserTrace = mongoose.model('UserTrace', userTraceSchema);
  
  module.exports = { UserTrace };
  
  
  