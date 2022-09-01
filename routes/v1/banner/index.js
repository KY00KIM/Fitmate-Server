const express = require('express');
const bannerRouter = express.Router();
const bannerController = require('../../../controller/banner');


bannerRouter.get('/', bannerController.getAllBanners);

bannerRouter.post('/', bannerController.registerBanner);

bannerRouter.get('/image/:bannerId', uploadImg('banner_image').single('image'), bannerController.uploadBannerImg);

module.exports = bannerRouter;