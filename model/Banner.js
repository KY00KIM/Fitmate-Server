const mongoose = require('mongoose');
const moment = require('moment');
const { Types: { ObjectId } } = mongoose.Schema;


const bannerSchema = mongoose.Schema({
    banner_image_url: {
        type: String,
        default: "https://d1cfu69a4bd45f.cloudfront.net/banner_image/FitMateBanner1.png"
    },
    banner_original_image_url: {
        type: String,
        default: "https://fitmate-s3-bucket.s3.ap-northeast-2.amazonaws.com/banner_image/FitMateBanner1.png",
        select: false,
    },
    connect_url:{
        type: String,
        default: "https://fitmate.co.kr/"
    },
    fitness_center_id:{
        type: ObjectId,
        ref: 'FitnessCenter',
    },
    is_deleted: {
        type: Boolean,
        required: true,
        default: false
    },
    click_num:{
        type: Number,
        default: 0
    },
    expire_date:{
        type: Date,
        default: moment().add(1, 'y'),
    },
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true }
});


const Banner = mongoose.model('Banner', bannerSchema);

module.exports = { Banner };