const User = require("../model/User");
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');

const userController = {
    /**
    * @path {GET} http://localhost:8000/v1/users
    * @description 모든 사용자를 조회하는 GET Method
    */
    getAllUsers : async (req, res) => {
        try {
            const users = await User.find({});
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](users, 'SUCCESS_OK', STATUS_CODE.SUCCESS_OK);
          } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError']('INVALID_USER', STATUS_CODE.INVALID_USER);
          }
    },
    /**
    * @path {GET} http://localhost:8000/v1/users/:userId
    * @description 특정 사용자를 조회하는 GET Method
    */
    getOneUser: async (req, res) =>{
        try {
            const {
                params: { userId },
              } = req;
            const user = await User.findById(userId);
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](user, 'SUCCESS_OK', STATUS_CODE.SUCCESS_OK);
        }catch(error){
            ResponseManager.getDefaultResponseHandler(res)['onError']('INVALID_APPOINTMENT_IDX', STATUS_CODE.INVALID_APPOINTMENT_IDX);
        }
    },
    /**
    * @path {POST} http://localhost:8000/v1/users/info/:userId
    * @description 특정 사용자를 조회하는 POST Method
    */
    writeUserInfo: async (req, res) =>{
        try {
            const {
              body: { user_profile_img, user_nickname, userLatitude, userLongitude},
            } = req;
            const post = await Appointment.create({
                user_profile_img,
                user_nickname,
                userLatitude,
                userLongitude,
            });
            ResponseManager.getDefaultResponseHandler(res)['onSuccess']({}, 'SUCCESS_NO_CONTENT', STATUS_CODE.SUCCESS_NO_CONTENT);
          } catch (error) {       
            ResponseManager.getDefaultResponseHandler(res)['onError']('INVALID_APPOINTMENT_IDX', STATUS_CODE.INVALID_APPOINTMENT_IDX);
          }
    },
    /**
    * @path {PATCH} http://localhost:8000/v1/users/:userId
    * @description 특정 사용자 정보의 일부를 변경하는 PATCH Method
    */
    updateUserInfo: async (req, res) =>{
        try {
            const {
                params: { userId },
              } = req;
            const user = await User.findById(userId);

            const result = await User.update(
                // 업데이트 내용
                {user_nickname: (req.body.user_nickname || user.user_nickname)},
                {overwrite:true}
            );
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SUCCESS_OK', STATUS_CODE.SUCCESS_OK);
        }catch(error){
            ResponseManager.getDefaultResponseHandler(res)['onError']('INVALID_APPOINTMENT_IDX', STATUS_CODE.INVALID_APPOINTMENT_IDX);
        }
    },

};

module.exports = userController;