const express = require('express');
const bannerRouter = express.Router();
const bannerController = require('../../../controller/banner');
const { uploadImg } = require('../../../middleware/multer');


bannerRouter.get('/', bannerController.getAllBanners);

bannerRouter.post('/', bannerController.registerBanner);

bannerRouter.get('/image/:bannerId', uploadImg('banner_image').single('image'), bannerController.uploadBannerImg);

bannerRouter.post('/clicked/:bannerId', bannerController.bannerClicked);

module.exports = bannerRouter;