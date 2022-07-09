const {Appointment} = require('../model/Appointment');
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
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](appointments, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },

  /**
   * @path {GET} http://localhost:8000/v1/appointments/:appointmentId
   * @description 특정 약속글을 조회하는 GET Method
   */

  getOneAppointment: async (req, res) => {
      try {
          const {
              params: { appointmentId },
            } = req;
          const appointment = await Appointment.findById(appointmentId);
          ResponseManager.getDefaultResponseHandler(res)['onSuccess'](appointment, 'SuccessOK', STATUS_CODE.SuccessOK);
      }catch(error){
          ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
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
      ResponseManager.getDefaultResponseHandler(res)['onSuccess']({}, 'SuccessCreated', STATUS_CODE.SuccessCreated);
    } catch (error) {       
      ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  }
};

module.exports = appointmentController;