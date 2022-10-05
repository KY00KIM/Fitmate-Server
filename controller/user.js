const { User } = require("../model/User");
const { Post } = require("../model/Post");
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
const { replaceS3toCloudFront } = require('../config/aws_s3');
const { Appointment } = require("../model/Appointment");
const {Chatroom} = require("../model/Chatroom");
const {Chat} = require("../model/Chats");
const {ObjectID, ObjectId} = require("mongodb");



const userController = {
  /**
  * @path {GET} http://fitmate.co.kr/v1/users
  * @description 모든 사용자를 조회하는 GET Method
  */
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}).lean();
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
      const user = await User.findById(userId).lean();
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
      const user = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true }).lean();
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
      const { user_nickname, user_gender, user_weekday, user_schedule_time, user_address, user_latitude, user_longitude, fitness_center, device_token, user_introduce } = req.body;
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
        user_introduce: user_introduce,
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
      user.user_profile_img = replaceS3toCloudFront(user.user_profile_img);
      return ResponseManager.getDefaultResponseHandler(res)['onSuccess'](user, 'SuccessCreated', STATUS_CODE.SuccessCreated);
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },
  assignUserV2: async (req, res) => {
    try {
      const { user_nickname, user_gender, user_weekday, user_schedule_time, user_address, user_latitude, user_longitude, fitness_center_id, device_token, user_introduce } = req.body;
      const locationId = await locationController.parseAddress(user_address);
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
        user_introduce: user_introduce,
        fitness_center_id: fitness_center_id,
        user_latitude: user_latitude,
        user_longitude: user_longitude,
        location_id: locationId,
        social: {
          user_id: req.user.social.uid || req.user.social.user_id,
          user_name: req.user.social.name || "",
          device_token: [device_token],
          provider: req.user.social.firebase.sign_in_provider,
          firebase_info: JSON.parse(JSON.stringify(req.user.social))
        },
        survey_candidates: req.body.survey_candidates || ["633a75c0ad5ad46e4d0f81df"]
      });
      const dupl = await Chatroom.find({$or:[{
          $and:[{chat_start_id: user._id},{chat_join_id: "6339147718df754a7873f48e"}]
        },{
          $and:[{chat_start_id: "6339147718df754a7873f48e"},{chat_join_id: user._id}]
        }]});
      if(dupl.length == 0){
        const chatroom = await Chatroom.create({
          chat_start_id: user._id,
          chat_join_id: "6339147718df754a7873f48e"
        });
        const chat = await Chat.create({
          chat_room_id:chatroom._id,
          last_chat: "핏메이트에 오신 것을 환영합니다!"
        });
      }
      return ResponseManager.getDefaultResponseHandler(res)['onSuccess'](user, 'SuccessCreated', STATUS_CODE.SuccessCreated);
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },

  loginUser: async (req, res) => {
    try {
      const uid = req.user.social.uid;
      const user_id = await checkUserValid(uid);
      if (user_id) {
        const user_object = req.user.social;
        const device_token = req.header('Device');
        const deviceRes = await checkDeviceToken(user_id, device_token);
        return ResponseManager.getDefaultResponseHandler(res)['onSuccess']({ user_id, device_set: deviceRes, fir_user: user_object }, 'SuccessOK', STATUS_CODE.SuccessOK);
      }

      return ResponseManager.getDefaultResponseHandler(res)['onError'](req.user.social, 404, STATUS_CODE.ClientErrorNotFound, { hi: 123 });
    } catch (error) {
      console.log(error)
      return ResponseManager.getDefaultResponseHandler(res)['onError'](error, STATUS_CODE.ClientErrorBadRequest);
    }
  },
  loginUserbyJWT: async (req, res) => {
    try {
      const user_id = req.user.id;
      if (!req.header('Device')) {
        return ResponseManager.getDefaultResponseHandler(res)['onError']("", 'DeviceTokenNotFound', STATUS_CODE.ClientErrorNotFound);
      } else {
        // 가독성
        const device_token = req.header('Device');
        const deviceRes = await checkDeviceToken(user_id, device_token);
        const user = await User.findById(user_id);
        ResponseManager.getDefaultResponseHandler(res)['onSuccess'](user, 'SuccessOK', STATUS_CODE.SuccessOK, user_id);
      }

    } catch (error) {
      console.log(error)
      return ResponseManager.getDefaultResponseHandler(res)['onError'](error, "ClientErrorNotFound", STATUS_CODE.ClientErrorBadRequest);
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
  },

  addBlockedUser: async (req, res) => {
    try {
      const { blocked_user_id } = req.body;
      const user_id = req.user.id;
      const result = await User.findByIdAndUpdate(user_id, { $push: { blocked_users: blocked_user_id } }, { new: true });
      ResponseManager.getDefaultResponseHandler(res)['onSuccess']({ result }, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  }
};

const checkDeviceToken = async (user_id, device_token) => {
  try {
    // 디바이스 토큰 3개로 제한 
    const user = await User.findById(user_id);
    if (device_token && !user.social.device_token.includes(device_token)) {
      await User.findByIdAndUpdate(user_id, { $pop: { "social.device_token": -1 } }, { new: true, runValidators: true })
      const updateduser = await User.findByIdAndUpdate(user_id, { $push: { "social.device_token": device_token } }, { new: true, runValidators: true })
      console.log(updateduser);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};


const checkUserValid = async (firebase_uid) => {
  try {
    const users = await User.find({ 'social.user_id': firebase_uid, is_deleted: false });
    if (!users[0]) return false;
    return users[0]._id;
  } catch (error) {
    console.log(error)
    return false;
  };
};

module.exports = userController;