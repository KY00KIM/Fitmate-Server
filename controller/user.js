const { User } = require("../model/User");
const locationController = require('./location');
const fitnesscenterController = require('./fitnesscenter')
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const timeConvert = require('../config/timeConvert');
const logger = require('../config/winston');
const userController = {
  /**
  * @path {GET} http://fitmate.co.kr/v1/users
  * @description 모든 사용자를 조회하는 GET Method
  */
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});
      //logger.info(`${req.decoded.id}`);
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](users, 'SUCCESS_OK', STATUS_CODE.SUCCESS_OK);
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },


  /**
  * @path {GET} http://fitmate.co.kr/v1/users/:userId
  * @description 특정 사용자를 조회하는 GET Method
  */
  // 사용자 리뷰 정보 하나 전송 + 없을 시 랜덤 전송
  getOneUser: async (req, res) => {
    try {
      const { userId } = req.params
      const user = await User.findById(userId);
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](user, 'SUCCESS_OK', STATUS_CODE.SUCCESS_OK);
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },



  /**
  * @path {PATCH} http://fitmate.co.kr/v1/users/:userId
  * @description 특정 사용자 정보의 일부를 변경하는 PATCH Method
  */
  updateUserInfo: async (req, res) => {
    try {
      const {
        params: { userId },
      } = req;
      //찾아서 업데이트
      const user = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](user, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      console.log(error)
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },


  /**
  * @path {POST} http://fitmate.co.kr/v1/users/oauth
  * @description 특정 사용자 정보의 일부를 변경하는 POST Method
  */
  assignUser: async (req, res) => {
    try {
      const { user_nickname, user_gender, user_weekday, user_schedule_time, user_address, user_latitude, user_longitude, fitness_center } = req.body;
      const locationId = await locationController.parseAddress(user_address);
      const center = await fitnesscenterController.getFitnessCenterId(fitness_center);
      const user = await User.create({
        // BODY for test
        user_name: req.user.social.name || "",
        user_email: req.user.social.email || "",
        user_address: user_address,
        user_nickname: user_nickname,
        user_profile_img: req.user.social.picture || "",
        user_schedule_time: user_schedule_time,
        user_weekday: user_weekday || null,
        user_gender: user_gender,
        fitness_center_id: center._id,
        user_latitude: user_latitude || 0.0,
        user_longitude: user_longitude || 0.0,
        location_id: locationId,
        social: {
          user_id: req.user.social.uid || req.user.social.user_id,
          user_name: req.user.social.name || "",
          provider: req.user.social.firebase.sign_in_provider,
          firebase_info: JSON.parse(JSON.stringify(req.user.social))
        }
      });
      return ResponseManager.getDefaultResponseHandler(res)['onSuccess'](user, 'SuccessCreated', STATUS_CODE.SuccessCreated);
    } catch (error) {
      console.log(error)
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },

  checkUserValid: async (req, res) => {
    try {
      const uid = req.user.social.uid
      const users = await User.find({ 'social.user_id': uid });
      if (!users[0])
        return ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);

      return ResponseManager.getDefaultResponseHandler(res)['onSuccess']({ user_id: users[0]._id }, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      console.log(error)
      return ResponseManager.getDefaultResponseHandler(res)['onError'](error, STATUS_CODE.ClientErrorBadRequest);
    }
  }
};

module.exports = userController;