const { User } = require("../model/User");
const postController = require('../controller/post')
const chatController = require('../controller/chat')
const reviewController = require('../controller/review')
const appointmentController = require('../controller/appointment')

const locationController = require('./location');
const fitnesscenterController = require('./fitnesscenter')
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const timeConvert = require('../config/timeConvert');
const logger = require('../config/winston');
const { uploadImg } = require('../middleware/multer')
const { replaceS3toCloudFront } = require('../config/aws_s3');
const { app } = require("firebase-admin");



const userController = {
  /**
  * @path {GET} http://fitmate.co.kr/v1/users
  * @description 모든 사용자를 조회하는 GET Method
  */
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});
      //logger.info(`${req.decoded.id}`);
      users.forEach((user) => {
        user.user_profile_img = replaceS3toCloudFront(user.user_profile_img)
      });

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
      user.user_profile_img = replaceS3toCloudFront(user.user_profile_img)
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
      const { userId } = req.params;
      //찾아서 업데이트
      const user = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });
      user.user_profile_img = replaceS3toCloudFront(user.user_profile_img)
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
      const { user_nickname, user_gender, user_weekday, user_schedule_time, user_address, user_latitude, user_longitude, fitness_center, device_token } = req.body;
      const locationId = await locationController.parseAddress(user_address);
      const center = await fitnesscenterController.getFitnessCenterId(fitness_center);
      const user = await User.create({
        // BODY for test
        user_name: req.user.social.name || "",
        user_email: req.user.social.email || "",
        user_address: user_address,
        user_nickname: user_nickname,
        user_profile_img: req.user.social.picture,
        user_schedule_time: user_schedule_time,
        user_weekday: user_weekday || null,
        user_gender: user_gender,
        fitness_center_id: center._id,
        user_latitude: user_latitude,
        user_longitude: user_longitude,
        location_id: locationId,
        social: {
          user_id: req.user.social.uid || req.user.social.user_id,
          user_name: req.user.social.name || "",
          device_token: [device_token],
          provider: req.user.social.firebase.sign_in_provider,
          firebase_info: JSON.parse(JSON.stringify(req.user.social))
        }
      });
      user.user_profile_img = replaceS3toCloudFront(user.user_profile_img)
      return ResponseManager.getDefaultResponseHandler(res)['onSuccess'](user, 'SuccessCreated', STATUS_CODE.SuccessCreated);
    } catch (error) {
      console.log(error)
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },

  loginUser: async (req, res) => {
    try {
      const uid = req.user.social.uid
      const user_id = await checkUserValid(uid)
      if (user_id) {
        const device_token = req.header('Device')
        const deviceRes = await checkDeviceToken(user_id, device_token)
        return ResponseManager.getDefaultResponseHandler(res)['onSuccess']({ user_id, device_set: deviceRes }, 'SuccessOK', STATUS_CODE.SuccessOK);
      }

      return ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    } catch (error) {
      console.log(error)
      return ResponseManager.getDefaultResponseHandler(res)['onError'](error, STATUS_CODE.ClientErrorBadRequest);
    }
  },

  uploadUserImg: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.user.id, { user_profile_img: replaceS3toCloudFront(req.file.location), user_original_profile_img: req.file.location }, { new: true, runValidators: true });
      return ResponseManager.getDefaultResponseHandler(res)['onSuccess'](replaceS3toCloudFront(req.file.location), 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      console.log(error)
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },

  userSignOut: async (req, res) => {
    try {
      const resultUser = await User.findByIdAndUpdate(req.user.id, { is_deleted: true });
      const resultPost = await postController.deleteManyPostByUser(req.user.id);
      const resultChatroom = await chatController.deleteManyChatroomByUser(req.user.id);
      const resultReview = await reviewController.deleteManyReviewByUser(req.user.id);
      const resultAppointment = await appointmentController.deleteManyAppointmentByUser(req.user.id);
      console.log("User : " + resultUser);
      console.log("Post : " + resultPost);
      console.log("Chatroom : " + resultChatroom)
      console.log("Review : " + resultReview)
      console.log("Appointment : " + resultAppointment)

      return ResponseManager.getDefaultResponseHandler(res)['onSuccess']({ resultUser, resultPost, resultChatroom, resultReview }, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  }


};

const checkDeviceToken = async (user_id, device_token) => {
  try {
    const user = await User.findById(user_id);
    if (device_token && !user.social.device_token.includes(device_token)) {
      const updateduser = await User.findByIdAndUpdate(user_id, { $push: { "social.device_token": device_token } }, { new: true, runValidators: true })
      return true
    }
    return false
  } catch (e) {
    return false
  }
};

const checkUserValid = async (firebase_uid) => {
  try {
    const users = await User.find({ 'social.user_id': firebase_uid, is_deleted: false });
    if (!users[0]) return false;
    return users[0]._id;
  } catch (error) {
    console.log(error)
    return false
  }

};

module.exports = userController;