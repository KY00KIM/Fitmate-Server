const { Appointment } = require('../model/Appointment');
const { User } = require('../model/User');
const { PushSchedule } = require('../model/PushSchedule');

const ResponseManager = require('../config/response');
const schedule = require('node-schedule');
const STATUS_CODE = require('../config/http_status_code');
const moment = require('moment');
const fitnesscenterController = require('./fitnesscenter');
const timeConvert = require('../config/timeConvert');
const { pushNotification, pushData } = require('./push');

const appointmentController = {
  /**
   * @path {GET} http://fitmate.co.kr/v1/appointments
   * @description 사용자의 모든 약속을 조회하는 GET Method
   */
  /// userId 필요
  getAllAppointment: async (req, res) => {
    try {
      let user_id = req.user.id;
      const appointments = await Appointment.find(
        { $or: [{ 'match_start_id': user_id }, { 'match_join_id': user_id }] });

      appointments.forEach((appointment) => {
        appointment.appointment_date = timeConvert.addNineHours(appointment.appointment_date);
        appointment.createdAt = timeConvert.addNineHours(appointment.createdAt);
        appointment.updatedAt = timeConvert.addNineHours(appointment.updatedAt);
      });
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](appointments, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },

  /**
   * @path {GET} http://fitmate.co,kr/v1/appointments/:appointmentId
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
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    }
  },


  /**
   * @path {POST} http://fitmate.co.kr/v1/appointments
   * @description 약속글을 생성하는 POST Method
   */
  writeAppointment: async (req, res) => {
    try {
      const {
        body: { fitness_center, match_start_id, match_join_id, appointment_date },
      } = req;
      const fitness_center_id = await fitnesscenterController.getFitnessCenterId(fitness_center);

      const match_start_user = await User.findById(match_start_id);
      const match_join_user = await User.findById(match_join_id);

      const appointment = await Appointment.create({
        "center_id": fitness_center_id,
        "match_start_id": match_start_id,
        "match_join_id": match_join_id,
        "appointment_date": appointment_date,
      });

      let rule = new schedule.RecurrenceRule();
      const review_date = moment(appointment_date).add(2, 'hours');

      // Review 요청 예약
      rule.year = moment(review_date).year();
      rule.month = moment(review_date).month() + 1;
      rule.date = moment(review_date).date();
      rule.hour = moment(review_date).hour();
      rule.minute = moment(review_date).minute();
      rule.second = moment(review_date).second();
      console.log(rule);

      // 리뷰 요청 알림 예약
      match_start_user.social.device_token.forEach((deviceToken) => {
        schedule.scheduleJob(rule, () => pushNotification(deviceToken, 'FitMate 리뷰 알림!', `${match_join_user.user_nickname}님과의 운동은 어떠셨나요?`));
      });
      match_join_user.social.device_token.forEach((deviceToken) => {
        schedule.scheduleJob(rule, () => pushNotification(deviceToken, 'FitMate 리뷰 알림!', `${match_join_user.user_nickname}님과의 운동은 어떠셨나요?`));
      });

      // DB에 저장
      await PushSchedule.create({
        pushType: "REVIEW",
        appointmentId: appointment._id,
        match_start_id: match_start_id,
        match_join_id: match_join_id,
        rule: review_date
      });

      const gps_date = moment(appointment_date).add(5, 'minutes');
      // GPS 요청 정보 예약
      rule.year = moment(gps_date).year();
      rule.month = moment(gps_date).month() + 1;
      rule.date = moment(gps_date).date();
      rule.hour = moment(gps_date).hour();
      rule.minute = moment(gps_date).minute();
      rule.second = moment(gps_date).second();

      data = {
        "appointmentId": appointment._id,
        Type: "GPS"
      }
      match_start_user.social.device_token.forEach((deviceToken) => {
        schedule.scheduleJob(rule, () => pushData(deviceToken, data));
      });
      match_join_user.social.device_token.forEach((deviceToken) => {
        schedule.scheduleJob(rule, () => pushData(deviceToken, data));
      });

      // DB에 저장
      await PushSchedule.create({
        pushType: "GPS",
        appointmentId: appointment._id,
        match_start_id: match_start_id,
        match_join_id: match_join_id,
        rule: gps_date
      });

      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](appointment, 'SuccessCreated', STATUS_CODE.SuccessCreated);

    } catch (error) {
      console.error(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    }
  },


  /**
   * @path {DELETE} http://fitmate.co.kr/v1/appointments/:appointmentId
   * @description 약속글을 삭제하는 DELETE Method
   */
  deleteAppointment: async (req, res) => {
    try {
      const {
        body: { fitness_center, match_start_id, match_join_id, appointment_date },
      } = req;
      const fitness_center_id = await fitnesscenterController.getFitnessCenterId(fitness_center);


      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](appointment, 'SuccessCreated', STATUS_CODE.SuccessCreated);

    } catch (error) {
      console.error(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    }
  },  
};

module.exports = appointmentController;