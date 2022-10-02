const mongoose = require('mongoose');
const { Types: { ObjectId, Double } } = mongoose.Schema;


const golfSchema = mongoose.Schema({
    existed:{
        type: Boolean,
        default: false
    },
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true }
});


const Golf = mongoose.model('Golf', golfSchema);

module.exports = { Golf };

