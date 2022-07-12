const {Appointment} = require('../model/Appointment');
const {User} = require('../model/User');

const ResponseManager = require('../config/response');
const schedule = require('node-schedule');
const STATUS_CODE = require('../config/http_status_code');
const moment = require('moment');

const {timeConvert} = require('../config/timeConvert');
const {pushNotification, pushData} = require('./push');

const appointmentController = {
  /**
   * @path {GET} http://localhost:8000/v1/appointments
   * @description 사용자의 모든 약속을 조회하는 GET Method
   */
  getAllAppointment : async (req, res) => {
    try {
      const appointments = await Appointment.find({});
      for(let i = 0; i < appointments.length; ++i){
        appointments[i].appointment_date = timeConvert(appointments[i].appointment_date);
        appointments[i].createdAt = timeConvert(appointments[i].createdAt);
        appointments[i].updatedAt = timeConvert(appointments[i].updatedAt);
      };
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
          if(appointment){
            appointment.appointment_date = timeConvert(appointment.appointment_date);
            appointment.createdAt = timeConvert(appointment.createdAt);
            appointment.updatedAt = timeConvert(appointment.updatedAt);
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](appointment, 'SuccessOK', STATUS_CODE.SuccessOK);
          }else{
            ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
          }
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
        body: { match_start_id, match_join_id, appointment_date},
      } = req;
      
      match_start_user = User.findById(match_start_id);
      match_join_user = User.findById(match_join_id);

      if(match_start_user && match_join_user){

        let rule = new schedule.RecurrenceRule();
        rule.year = moment(appointment_date).year();
        rule.month = moment(appointment_date).month() + 1;
        rule.date = moment(appointment_date).date() + 1;
        
        // 리뷰 요청 알림 예약
        console.log(rule)
        schedule.scheduleJob(rule, pushNotification(match_start_user.social.device_token, `${match_join_user.user_nickname}님과의 운동은 어떻셨나요?`));
        schedule.scheduleJob(rule, pushNotification(match_join_user.social.device_token, `${match_start_user.user_nickname}님과의 운동은 어떻셨나요?`));
      
        // GPS 요청 정보 예약
        rule.hour = moment(appointment_date).hour();
        rule.minute = moment(appointment_date).minute();
        rule.second = moment(appointment_date).second();

        console.log(rule)
        schedule.scheduleJob(rule, pushData(match_start_user.social.device_token, `RGB`));
        schedule.scheduleJob(rule, pushData(match_join_user.social.device_token, `RGB`));
       

        const post = await Appointment.create({
          "match_start_id": match_start_id,
          "match_join_id": match_join_id,
          "appointment_date": appointment_date,
        });

      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](post, 'SuccessCreated', STATUS_CODE.SuccessCreated);
    } else{ 
      ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
   }
    } catch (error) {       
      ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    }
  }
};

module.exports = appointmentController;