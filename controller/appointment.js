const { Appointment } = require('../model/Appointment');
const { User } = require('../model/User');
const { PushSchedule } = require('../model/PushSchedule');
const { Review } = require('../model/Review');
const ResponseManager = require('../config/response');
const schedule = require('node-schedule');
const STATUS_CODE = require('../config/http_status_code');
const moment = require('moment');
const fitnesscenterController = require('./fitnesscenter');
const timeConvert = require('../config/timeConvert');
const { pushNotificationUser, pushDataUser } = require('./push');

const appointmentController = {
  /**
   * @path {GET} http://fitmate.co.kr/v1/appointments
   * @description 사용자의 모든 약속을 조회하는 GET Method
   */
  
  getAllAppointment: async (req, res) => {
    try {
      let user_id = req.user.id;
      const appointments = await Appointment.find(
        { $and:[{$or: [{ 'match_start_id': user_id }, { 'match_join_id': user_id }]}, {'is_deleted': false}] });

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
      const appointment = await Appointment.findById(appointmentId)
          .populate('match_start_id')
          .populate('match_join_id');
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

      const match_start_user = await User.findById(match_start_id).lean();
      const match_join_user = await User.findById(match_join_id).lean();

      const appointment = await Appointment.create({
        "center_id": fitness_center_id,
        "match_start_id": match_start_id,
        "match_join_id": match_join_id,
        "appointment_date": appointment_date,
        "isReviewed": false,
      });

      let rule = new schedule.RecurrenceRule();

      // 약속 알림
      rule.year = moment(appointment_date).year();
      rule.month = moment(appointment_date).month() + 1;
      rule.date = moment(appointment_date).date();
      rule.hour = moment(appointment_date).hour();
      rule.minute = moment(appointment_date).minute() + 1;
      rule.second = moment(appointment_date).second();

      schedule.scheduleJob('APPOINTMENT' + appointment._id, rule, () => pushNotificationUser(match_start_id, 'FitMate 약속 알림!', `${match_join_user.user_nickname}님과 운동 약속이 잡혔습니다!`));
      schedule.scheduleJob('APPOINTMENT' + appointment._id, rule, () => pushNotificationUser(match_join_user, 'FitMate 약속 알림!', `${match_start_user.user_nickname}님과 운동 약속이 잡혔습니다!`));

      // DB에 저장
      await PushSchedule.create({
        pushType: "APPOINTMENT",
        appointmentId: appointment._id,
        match_start_id: match_start_id,
        match_join_id: match_join_id,
        rule: moment(appointment_date),
        is_deleted: false
      });


      const review_date = moment(appointment_date).add(2, 'hours');

      // Review 요청 예약
      rule.year = moment(review_date).year();
      rule.month = moment(review_date).month() + 1;
      rule.date = moment(review_date).date();
      rule.hour = moment(review_date).hour();
      rule.minute = moment(review_date).minute();
      rule.second = moment(review_date).second();

      schedule.scheduleJob('REVIEW' + appointment._id, rule, () => pushNotificationUser(match_start_id, 'FitMate 리뷰 알림!', `${match_join_user.user_nickname}님과의 운동은 어떠셨나요?`));
      schedule.scheduleJob('REVIEW' + appointment._id, rule, () => pushNotificationUser(match_join_user, 'FitMate 리뷰 알림!', `${match_start_user.user_nickname}님과의 운동은 어떠셨나요?`));

      // DB에 저장
      await PushSchedule.create({
        pushType: "REVIEW",
        appointmentId: appointment._id,
        match_start_id: match_start_id,
        match_join_id: match_join_id,
        rule: review_date,
        is_deleted: false
      });

      const gps_date = moment(appointment_date).add(5, 'minutes');
      // GPS 요청 정보 예약
      rule.year = moment(gps_date).year();
      rule.month = moment(gps_date).month() + 1;
      rule.date = moment(gps_date).date();
      rule.hour = moment(gps_date).hour();
      rule.minute = moment(gps_date).minute();
      rule.second = moment(gps_date).second();

      const data = {
        "appointmentId": appointment._id,
        "Type": "GPS"
      }

      schedule.scheduleJob('GPS'+ appointment._id, rule, () => pushDataUser(match_start_id, data));
      schedule.scheduleJob('GPS'+ appointment._id, rule, () => pushDataUser(match_join_id, data));

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
   * @path {POST} http://fitmate.co.kr/v1/appointments
   * @description 약속글을 생성하는 POST Method
   */
  writeAppointmentV2: async (req, res) => {
    try {
      const {
        body: { fitness_center_id, match_start_id, match_join_id, appointment_date },
      } = req;

      const match_start_user = await User.findById(match_start_id).lean();
      const match_join_user = await User.findById(match_join_id).lean();

      const appointment = await Appointment.create({
        "center_id": fitness_center_id,
        "match_start_id": match_start_id,
        "match_join_id": match_join_id,
        "appointment_date": appointment_date,
        "isReviewed": false,
      });

      let rule = new schedule.RecurrenceRule();

      // 약속 알림
      rule.year = moment(appointment_date).year();
      rule.month = moment(appointment_date).month() + 1;
      rule.date = moment(appointment_date).date();
      rule.hour = moment(appointment_date).hour();
      rule.minute = moment(appointment_date).minute() + 1;
      rule.second = moment(appointment_date).second();

      schedule.scheduleJob('APPOINTMENT' + appointment._id, rule, () => pushNotificationUser(match_start_id, 'FitMate 약속 알림!', `${match_join_user.user_nickname}님과 운동 약속이 잡혔습니다!`));
      schedule.scheduleJob('APPOINTMENT' + appointment._id, rule, () => pushNotificationUser(match_join_user, 'FitMate 약속 알림!', `${match_start_user.user_nickname}님과 운동 약속이 잡혔습니다!`));

      // DB에 저장
      await PushSchedule.create({
        pushType: "APPOINTMENT",
        appointmentId: appointment._id,
        match_start_id: match_start_id,
        match_join_id: match_join_id,
        rule: moment(appointment_date),
        is_deleted: false
      });


      const review_date = moment(appointment_date).add(2, 'hours');

      // Review 요청 예약
      rule.year = moment(review_date).year();
      rule.month = moment(review_date).month() + 1;
      rule.date = moment(review_date).date();
      rule.hour = moment(review_date).hour();
      rule.minute = moment(review_date).minute();
      rule.second = moment(review_date).second();

      schedule.scheduleJob('REVIEW' + appointment._id, rule, () => pushNotificationUser(match_start_id, 'FitMate 리뷰 알림!', `${match_join_user.user_nickname}님과의 운동은 어떠셨나요?`));
      schedule.scheduleJob('REVIEW' + appointment._id, rule, () => pushNotificationUser(match_join_user, 'FitMate 리뷰 알림!', `${match_start_user.user_nickname}님과의 운동은 어떠셨나요?`));

      // DB에 저장
      await PushSchedule.create({
        pushType: "REVIEW",
        appointmentId: appointment._id,
        match_start_id: match_start_id,
        match_join_id: match_join_id,
        rule: review_date,
        is_deleted: false
      });

      const gps_date = moment(appointment_date).add(5, 'minutes');
      // GPS 요청 정보 예약
      rule.year = moment(gps_date).year();
      rule.month = moment(gps_date).month() + 1;
      rule.date = moment(gps_date).date();
      rule.hour = moment(gps_date).hour();
      rule.minute = moment(gps_date).minute();
      rule.second = moment(gps_date).second();

      const data = {
        "appointmentId": appointment._id,
        "Type": "GPS"
      }

      schedule.scheduleJob('GPS'+ appointment._id, rule, () => pushDataUser(match_start_id, data));
      schedule.scheduleJob('GPS'+ appointment._id, rule, () => pushDataUser(match_join_id, data));

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
      const appointmentId = req.params.appointmentId;
      const result = await Appointment.findByIdAndUpdate(appointmentId, {'is_deleted': true}, { new: true, runValidators: true}).lean();
      const schedules = schedule.scheduledJobs;
      schedule.cancelJob(schedules['APPOINTMENT' + appointmentId]);
      schedule.cancelJob(schedules['REVIEW' + appointmentId]);
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessDeleted', STATUS_CODE.SuccessOK);

    } catch (error) {
      console.error(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    }
  },
  deleteManyAppointmentByUser: async (user_id) => {
    try {
      const result = await Appointment.updateMany({ $or: [{ 'match_start_id': user_id }, { 'match_join_id': user_id }] }, { 'is_deleted': true });
      return result;
    } catch (e) {
      console.log(e)
      return (e)
    }
  },
  calendarAppointment: async  (req, res) => {
    try{
      const user_id = req.user.id;
      let docs = {}
      docs.appointments = await Appointment.find(
          {
            $and:[
              {$or: [{ 'match_start_id': user_id }, { 'match_join_id': user_id }]},
              {is_deleted:false}
          ]})
          .populate('match_start_id', 'user_nickname user_profile_img')
          .populate('match_join_id', 'user_nickname user_profile_img')
          .populate('center_id');
           // console.log('appointments: ',appointments);
      docs.reviews = [];
      for(let result of docs.appointments){
        if(result.isReviewed){
          const reviews = await Review.findOne({appointment_id: result._id});
          docs.reviews.push(reviews);
          result.appointment_date = timeConvert.addNineHours(result.appointment_date);
          result.createdAt = timeConvert.addNineHours(result.createdAt);
          result.updatedAt = timeConvert.addNineHours(result.updatedAt);
        }
      }
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](docs, 'SuccessOK', STATUS_CODE.SuccessOK);
    }catch(error){
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    }
  }
};

module.exports = appointmentController;