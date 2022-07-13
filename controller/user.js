const { User } = require("../model/User");
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const timeConvert = require('../config/timeConvert');
const logger = require('../config/winston');
const userController = {
  /**
  * @path {GET} http://localhost:8000/v1/users
  * @description 모든 사용자를 조회하는 GET Method
  */
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});
      logger.info(`${req.decoded.id}`);
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](users, 'SUCCESS_OK', STATUS_CODE.SUCCESS_OK);
    } catch (error) {
      logger.error(`${req.decoded.id}`)
      ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },


  /**
  * @path {GET} http://localhost:8000/v1/users/:userId
  * @description 특정 사용자를 조회하는 GET Method
  */
  // 사용자 리뷰 정보 하나 전송 + 없을 시 랜덤 전송
  getOneUser: async (req, res) => {
    try {
      const {
        params: { userId },
      } = req;
      const user = await User.findById(userId);
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](user, 'SUCCESS_OK', STATUS_CODE.SUCCESS_OK);
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },


  /**
  * @path {POST} http://localhost:8000/v1/users/info/:userId
  * @description 특정 사용자 정보를 등록하는 POST Method
  */
  writeUserInfo: async (req, res) => {
    try {
      const {
        body: { user_profile_img, user_nickname, userLatitude, userLongitude },
      } = req;
      const post = await Appointment.create({
        user_profile_img,
        user_nickname,
        userLatitude,
        userLongitude,
      });
      ResponseManager.getDefaultResponseHandler(res)['onSuccess']({}, 'SUCCESS_NO_CONTENT', STATUS_CODE.SUCCESS_NO_CONTENT);
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },


  /**
  * @path {PATCH} http://localhost:8000/v1/users/:userId
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
      ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },


  /**
  * @path {POST} http://localhost:8000/v1/users/oauth
  * @description 특정 사용자 정보의 일부를 변경하는 POST Method
  */
  assignUser: async (req, res) => {
    console.log(11111)
    try {
      const {
        body: { user_nickname, user_gender, user_weekday, user_schedule_time, user_address, user_latitude, user_longitude, fitness_center_name },
      } = req;
      //create -> find fitness_center_id
      const user = await User.create({
        // BODY for test
        user_name: req.body.name,
        user_pwd: "",
        user_email: req.body.email,
        //user_address parse 
        user_address: user_address,
        user_nickname: user_nickname,
        user_profile_img: req.body.picture,
        user_schedule_time: user_schedule_time,
        user_weekday: user_weekday,
        user_introduce: "",
        user_fitness_part: [],
        //user age from client required
        user_age: 0,
        user_gender: user_gender,
        //fitness_center_id to be filled
        fitness_center_id: "62cafe32db78d1f44debd905",
        user_latitude: user_latitude,
        user_longitude: user_longitude,
        //location parse & fill 
        location_id: "62cafe32db78d1f44debd905",
        social: {
          user_id: req.body.uid,
          user_name: req.body.name,
          provider: req.body.firebase.sign_in_provider,
          firebase_info: {}
        }
      });
      await user.save()
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](user, 'SUCCESS_NO_CONTENT', STATUS_CODE.SUCCESS_NO_CONTENT);
    } catch (error) {
      console.log(error)
      ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  }
};

module.exports = userController;