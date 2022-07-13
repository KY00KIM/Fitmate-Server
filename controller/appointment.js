const {Appointment} = require('../model/Appointment');
const {User} = require('../model/User');

const ResponseManager = require('../config/response');
const schedule = require('node-schedule');
const STATUS_CODE = require('../config/http_status_code');
const moment = require('moment');

const timeConvert = require('../config/timeConvert');
const {pushNotification, pushData} = require('./push');

const appointmentController = {
  /**
   * @path {GET} http://localhost:8000/v1/appointments
   * @description 사용자의 모든 약속을 조회하는 GET Method
   */
  /// userId 필요
  getAllAppointment : async (req, res) => {
    try {
      const appointments = await Appointment.find({});
      appointments.forEach((appointment) =>{        
        appointment.appointment_date = timeConvert.addNineHours(appointment.appointment_date);
        appointment.createdAt = timeConvert.addNineHours(appointment.createdAt);
        appointment.updatedAt = timeConvert.addNineHours(appointment.updatedAt);
      });
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
          const appointment = await Appointment.findById(appointmentId).populate('match_start_id').populate('match_join_id');
          appointment.appointment_date = timeConvert.addNineHours(appointment.appointment_date);
          appointment.createdAt = timeConvert.addNineHours(appointment.createdAt);
          appointment.updatedAt = timeConvert.addNineHours(appointment.updatedAt);
          ResponseManager.getDefaultResponseHandler(res)['onSuccess'](appointment, 'SuccessOK', STATUS_CODE.SuccessOK);
      }catch(error){
          ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
      }
  },


  /**
   * @path {POST} http://localhost:8000/v1/appointments
   * @description 약속글을 생성하는 POST Method
   */
  writeAppointment: async (req, res) => {
    try {
      const {
        body: { match_start_id, match_join_id, appointment_date},
      } = req;
      
      match_start_user = User.findById(match_start_id);
      match_join_user = User.findById(match_join_id);

      const appointment = await Appointment.create({
        "match_start_id": match_start_id,
        "match_join_id": match_join_id,
        "appointment_date": appointment_date,
      });

      // appointment_date= 2022-7-15T21:00:00
      let rule = new schedule.RecurrenceRule();
      rule.year = moment(appointment_date).year();        // 2022
      rule.month = moment(appointment_date).month() + 1;  // 7
      rule.date = moment(appointment_date).date() + 1;    // 16

      rule.hour = 0;
      rule.minute = 0;
      rule.second = 0;
      console.log(rule);

      // 리뷰 요청 알림 예약
      schedule.scheduleJob(rule, pushNotification(match_start_user.social.device_token,'FitMate 리뷰 알림!' ,`${match_join_user.user_nickname}님과의 운동은 어떻셨나요?`));
      schedule.scheduleJob(rule, pushNotification(match_join_user.social.device_token, 'FitMate 리뷰 알림!', `${match_start_user.user_nickname}님과의 운동은 어떻셨나요?`));
      
      // GPS 요청 정보 예약
      rule.hour = moment(appointment_date).hour();
      rule.minute = moment(appointment_date).minute();
      rule.second = moment(appointment_date).second();

      data = {
        "appointmentId":appointment._id,
        "GPS": "GPS"
      }
      schedule.scheduleJob(rule, pushData(match_start_user.social.device_token, data));
      schedule.scheduleJob(rule, pushData(match_join_user.social.device_token, data));
      
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](appointment, 'SuccessCreated', STATUS_CODE.SuccessCreated);

    } catch (error) {       
      ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    }
  }
};

module.exports = appointmentController;