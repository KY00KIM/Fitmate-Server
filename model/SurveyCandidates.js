const mongoose = require('mongoose');
const { Types: { ObjectId, Double } } = mongoose.Schema;


const surveyCandidatesSchema = mongoose.Schema({
    survey_content: {
        type:String,
        required: true
    }
    ,
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true }
});


const SurveyCandidates = mongoose.model('SurveyCandidates', surveyCandidatesSchema);

module.exports = { SurveyCandidates };

