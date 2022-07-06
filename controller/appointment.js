const Appointment = require('../model/Appointment');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');

const appointmentController = {
  /**
   * @path {GET} http://localhost:8000/v1/appointments
   * @description 사용자의 모든 약속을 조회하는 GET Method
   */
  getAllAppointment : async (req, res) => {
    try {
      const appointments = await Appointment.find({});
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](appointments, 'SUCCESS_OK', STATUS_CODE.SUCCESS_OK);
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError']('INVALID_USER', STATUS_CODE.INVALID_USER);
    }
  },

  /**
   * @path {GET} http://localhost:8000/v1/appointments/:appointmentId
   * @description 특정 약속글을 조회하는 GET Method
   *
   *  Path Variables 방식
   *
   *  ex) 아래 GET 주소 에서 :appointmentId 는 서버에서 설정한 주소 키 값이다.
   *      값을 찾을 때는 req.params.appointmentId 로 값을 찾는다.
   */

  getOneAppointment: async (req, res) => {
      try {
          const {
              params: { appointmentId },
            } = req;
          const appointment = await Appointment.findById(appointmentId);
          ResponseManager.getDefaultResponseHandler(res)['onSuccess'](appointment, 'SUCCESS_OK', STATUS_CODE.SUCCESS_OK);
      }catch(error){
          ResponseManager.getDefaultResponseHandler(res)['onError']('INVALID_APPOINTMENT_IDX', STATUS_CODE.INVALID_APPOINTMENT_IDX);
      }
  },


  /**
   * @path {POST} http://localhost:8000/v1/appointments
   * @description 약속글을 생성하는 POST Method
   */
  writeAppointment: async (req, res) => {
    try {
      const {
        body: { match_start_id, match_join_id, appointment_location, appointment_date},
      } = req;
      const post = await Appointment.create({
        match_start_id,
        match_join_id,
        appointment_location,
        appointment_date,
      });
      ResponseManager.getDefaultResponseHandler(res)['onSuccess']({}, 'SUCCESS_NO_CONTENT', STATUS_CODE.SUCCESS_NO_CONTENT);
    } catch (error) {       
      ResponseManager.getDefaultResponseHandler(res)['onError']('INVALID_APPOINTMENT_IDX', STATUS_CODE.INVALID_APPOINTMENT_IDX);
    }
  }
};

module.exports = appointmentController;