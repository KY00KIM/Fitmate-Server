const { Banner } = require('../model/Banner');
const moment = require('moment');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');

const bannerController = {
    getAllBanners: async (req, res) => {
        try {
            const today = moment().startOf('day');
            const banners = await Banner.find({ is_deleted: false, expire_date: {$gte: today.toDate()} }).sort({ createdAt: -1 }).lean();
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](banners, 'SuccessOK', STATUS_CODE.SuccessOK);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    registerBanner: async(req, res) => {
        try{
            const {
                body: { center_url, fitness_center_id, expire_date},
            } = req;

            const banner = await Banner.create({
                center_url: center_url,
                fitness_center_id: fitness_center_id,
                expire_date: moment(expire_date),
            });
            ResponseManager.getDefaultResponseHandler(res)['onError'](banner, 'Banner Created', STATUS_CODE.SuccessCreated);
        }catch(error){
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'Invalid Banner', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    uploadBannerImg: async (req, res) =>{
        try{
            const { bannerId } = req.params;
            const banner = await Banner.findByIdAndUpdate(bannerId, { banner_image_url: replaceS3toCloudFront(req.file.location), banner_original_image_url: req.file.location} ,{ new: true, runValidators: true });
            return ResponseManager.getDefaultResponseHandler(res)['onSuccess'](replaceS3toCloudFront(req.file.location), 'SuccessOK', STATUS_CODE.SuccessOK);
        }catch(error){
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'Invalid Banner Image', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    bannerClicked: async (req, res) =>{
        try{
            const { bannerId } = req.params;
            const banner = await Banner.findByIdAndUpdate(bannerId, { $inc:{click_num: 1}} ,{ new: true, runValidators: true }).lean();
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](banner, 'Clicked SuccessOK', STATUS_CODE.SuccessOK);
        }catch(error){
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'Invalid Banner', STATUS_CODE.ClientErrorBadRequest);
        }
    },
};



module.exports = bannerController;