const mongoose = require('mongoose');
const { Types: { ObjectId, Double } } = mongoose.Schema;


const fitnessCenterInfoSchema = mongoose.Schema({
    center_id: {
        type: ObjectId,
        ref: 'FitnessCenter',
        unique: true
    },
    male_trainer:{
        type: Number,
        default: 0
    },
    female_trainer:{
        type: Number,
        default: 0
    },
    introduce:{
        type: String
    },
    golf_program:{
        type: ObjectId,
        ref: 'Golf'
    },
    spinning:{
        type: ObjectId,
        ref: 'Spinning'
    },
    gx_program:{
        type: ObjectId,
        ref: 'GXExercise'
    },
    center_area:{
        type: Double
    },
    phone_num:{
        type: String
    },
    pt_price:[{
        count:{
            type: Number
        },
        one_price:{
            type: Number
        }
    }],
    price_for_day:{
        type: Number
    },
    price_for_1month:{
        type: Number
    },
    price_for_6month:{
        type: Number
    },
    price_for_year:{
        type: Number
    },
    parking:{
        type: Boolean,
        default: false
    },
    toilet:{
        type: Boolean,
        default: true
    },
    shower:{
        type:Boolean,
        default: false
    },
    back:[{
        type: String
    }],
    shoulder:[{
        type: String
    }],
    core:[{
        type: String
    }],
    arm:[{
        type: String
    }],
    chest:[{
        type: String
    }],
    lower_body:[{
        type: String
    }],
    etc:[{
        type: String
    }]
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true }
});


const FitnessCenterInfo = mongoose.model('FitnessCenterInfo', fitnessCenterInfoSchema);

module.exports = { FitnessCenterInfo };

