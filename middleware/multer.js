const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3 } = require('../config/aws_s3');
const moment = require('moment');
const path = require('path');
const SlackNotify = require('slack-notify');
const MY_SLACK_WEBHOOK_URL = process.env.MY_SLACK_WEBHOOK_URL;
const slack = SlackNotify(MY_SLACK_WEBHOOK_URL);

const uploadImg = (storePath) => {
    return multer({
        storage: multerS3({
            s3: s3,
            bucket: process.env.AWS_BUCKET_NAME,
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname })
            },
            key: function (req, file, cb) {
                const ext = path.extname(file.originalname);
                const extentsion = file.mimetype.split('/')[1];
                console.log(file)
                slack.send({
                    channel: '#error',
                    text: `FILE: ${JSON.stringify(file)} \nExtentsion: ${extentsion}} \nEXT: ${ext}`,
                    username:'IMG_URL'
                });
                if (storePath == "profile_image"){
                    cb(null, `${storePath}/${req.user.id || file.originalname}_${moment(Date.now()).format('YYYY_MM_DD_HH_mm_ss')}${ext || 'jpeg'}`);
                } else if(storePath == "post_image"){
                    cb(null, `${storePath}/${req.params.postId || file.originalname}_${moment(Date.now()).format('YYYY_MM_DD_HH_mm_ss')}${ext || 'jpeg'}`)
                }else if(storePath == "banner_image"){
                    cb(null, `${storePath}/${req.params.bannerId || file.originalname}_${moment(Date.now()).format('YYYY_MM_DD_HH_mm_ss')}${ext || 'jpeg'}`)
                };
            },
        })
    })
}

module.exports = { uploadImg };
