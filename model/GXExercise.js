const mongoose = require('mongoose');
const { Types: { ObjectId, Double } } = mongoose.Schema;


const GXExerciseSchema = mongoose.Schema({
    existed:{
        type: Boolean,
        default: false
    },
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true }
});


const GXExercise = mongoose.model('GXExercise', GXExerciseSchema);

module.exports = { GXExercise };

