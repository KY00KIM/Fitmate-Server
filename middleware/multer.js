const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3 } = require('../config/aws_s3');
const moment = require('moment');

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
                const extentsion = file.mimetype.split('/')[1];
                if (storePath == "profile_image")
                    cb(null, `${storePath}/${req.user.id || file.originalname}_${moment(Date.now()).format('YYYY_MM_DD_HH_mm_ss')}.${extentsion || 'jpeg'}`);
                else {
                    cb(null, `${storePath}/${req.params.postId || file.originalname}_${moment(Date.now()).format('YYYY_MM_DD_HH_mm_ss')}.${extentsion || 'jpeg'}`)
                }
            },
        })
    })
}

module.exports = { uploadImg };
