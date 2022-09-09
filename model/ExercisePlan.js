const mongoose = require('mongoose');
const { Types: { ObjectId } } = mongoose.Schema;


const exerciseplanSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: 'User'
    },
    exercise_data:{
        type: Date,
        required: true
    },
    exercise_location:{
        type: ObjectId,
        ref: 'FitnessCenter'
    },
    is_deleted: {
        type: Boolean,
        required: true,
        default: false
    },
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true }
});


const ExercisePlan = mongoose.model('ExercisePlan', exerciseplanSchema);

module.exports = { ExercisePlan };