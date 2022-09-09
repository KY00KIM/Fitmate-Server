const admin = require('firebase-admin');
const schedule = require('node-schedule');
const moment = require('moment');
const timeConvert = require('../config/timeConvert');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const { User } = require("../model/User");
const { PushSchedule } = require('../model/PushSchedule');

async function pushNotificationUser(userId, TITLE, BODY){
    const user = await User.findById(userId);
    user.social.device_token.forEach((deviceToken) => {
        pushNotification(deviceToken, TITLE, BODY);
    });
};

async function pushDataUser(userId, Data){
    const user = await User.findById(userId);
    user.social.device_token.forEach((deviceToken) => {
        pushData(deviceToken, Data);
    });
};
 
async function pushNotification(deviceToken="디바이스 토큰값", TITLE="No Title", BODY="No Body"){
    const message = {
        notification: {
                title: TITLE,
                body: BODY,
            },
        token: deviceToken,
        }
        admin
        .messaging()
        .send(message)
        .catch(function (err) {
            console.log('Error Sending message!!! : ', err)
            throw Error(err); 
    });
};

// To be Fixed
async function pushData(deviceToken="디바이스 토큰값",Data="No Data"){
    const message = {
        data: Data,
        token: deviceToken,
        }
        admin
        .messaging()
        .send(message)
        .catch(function (err) {
            console.log('Error Sending message!!! : ', err)
            throw Error(err); 
    });
};

async function registerPush(date = Date.now()){
    try{
        date = timeConvert.subtractNineHours(date);

        const pushes = await PushSchedule.find({
            rule: {$gte: new Date(date)}
        }).populate('match_start_id', '_id user_nickname').populate('match_join_id', '_id user_nickname');

        pushes.forEach((push)=>{  
            let rule = new schedule.RecurrenceRule();
            rule.year = moment(push.rule).year();     
            rule.month = moment(push.rule).month();
            rule.date = moment(push.rule).date();
            rule.hour = moment(push.rule).hour();
            rule.minute = moment(push.rule).minute();
            rule.second = moment(push.rule).second();
            if(push.pushType == 'REVIEW'){
                schedule.scheduleJob('REVIEW' + push.appointmentId, rule, () => pushNotificationUser(push.match_start_id._id,'FitMate 리뷰 알림!' ,`${push.match_join_id.user_nickname}님과의 운동은 어떻셨나요?`));
                schedule.scheduleJob('REVIEW' + push.appointmentId, rule, () => pushNotificationUser(push.match_join_id._id, 'FitMate 리뷰 알림!', `${push.match_start_id.user_nickname}님과의 운동은 어떻셨나요?`));
            }else if(push.pushType == 'GPS'){
                const data = {
                    "appointmentId":push.appointmentId,
                    "GPS": "GPS"
                  }
                schedule.scheduleJob('GPS'+ push.appointmentId, rule, () => pushDataUser(push.match_start_user, data));
                schedule.scheduleJob('GPS'+ push.appointmentId, rule, () => pushDataUser(push.match_join_user, data));
            }else if(push.pushType == 'APPOINTMENT'){
                schedule.scheduleJob('APPOINTMENT'+ push.appointmentId,rule, () => pushNotificationUser(push.match_start_id, 'FitMate 약속 알림!', `${match_join_user.user_nickname}님과 운동 약속이 잡혔습니다!`));
                schedule.scheduleJob('APPOINTMENT'+ push.appointmentId,rule, () => pushNotificationUser(push.match_join_user, 'FitMate 약속 알림!', `${match_start_user.user_nickname}님과 운동 약속이 잡혔습니다!`));
            }else if(push.pushType == 'NOTICE'){
                console.log("NOTICE NOT FINISHED");
            }else if(push.pushType == 'EXERCISE'){
                console.log("EXERCISE NOT FINISHED");
            }
            else{
                console.log('push', push);
                console.log('Error Type push');
            }
        });
    } catch(error) {
        console.error(error);
    }
};

async function pushChat(req, res){
    try {
        const {
            params: { userId },
          } = req;
        await pushNotificationUser(userId , "FitMate", "메이트 채팅이 도착했어요!");
        ResponseManager.getDefaultResponseHandler(res)['onSuccess']([], 'SuccessOK', STATUS_CODE.SuccessOK);
      } catch (error) {
        ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
      }
};

async function pushPopup(req, res){
    try {
        const {
            body: { notification },
        } = req;
    
        const data = {
            "notification": notification,
            "Type": "NOTICE"
        };
        const users = await User.find();
        for(const user of users){
            for(const deviceToken of user.social.device_token){
                await pushData(deviceToken, data);
            };
            await PushSchedule.create({
                pushType: "NOTICE",
                match_start_id: user._id,
                match_join_id: user._id,
                rule: moment(Date.now()),
                notification_body: notification,
                is_deleted: false
            });
        };

        ResponseManager.getDefaultResponseHandler(res)['onSuccess']([], 'SuccessOK', STATUS_CODE.SuccessOK);
      } catch (error) {
        ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
      }
};

async function pushTest(req, res){
    try {
        const {
            body: { userId },
        } = req;
    
        const user = await User.findById(userId);  
            
        const data = {
            "notification": "TEST",
            "Type": "TEST"
        };
        user.social.device_token.forEach((deviceToken) => {
            pushData(deviceToken, data);
        });
        ResponseManager.getDefaultResponseHandler(res)['onSuccess']([], 'SuccessOK', STATUS_CODE.SuccessOK);
      } catch (error) {

        console.error(error);
        ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
      }
};

async function getUserPush(req, res){
    try {
        const result = await PushSchedule.find({$and:[
            {is_deleted:false}, {pushType: {$ne:"GPS"}},{$or:[{match_start_id: req.user.id}, {match_join_id: req.user.id}]}
            ]})
            .populate('match_start_id', 'user_nickname user_profile_img')
            .populate('match_join_id', 'user_nickname user_profile_img');
        ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'Clear Success', STATUS_CODE.SuccessOK);
      } catch (error) {
        ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
      }
};

async function deletePush(req, res){
    try{
        const result = await PushSchedule.findByIdAndUpdate(req.params.pushId, {is_deleted: true});
        ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'Delete Success', STATUS_CODE.SuccessOK);
    }catch(error){
        ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
};
module.exports = {pushNotificationUser, pushDataUser, pushChat, registerPush, pushPopup, pushTest, getUserPush, deletePush};