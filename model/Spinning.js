const mongoose = require('mongoose');
const { Types: { ObjectId, Double } } = mongoose.Schema;


const spinningSchema = mongoose.Schema({
    existed:{
        type: Boolean,
        default: false
    },
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true }
});


const Spinning = mongoose.model('Spinning', spinningSchema);

module.exports = { Spinning };

