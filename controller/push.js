const admin = require('firebase-admin');
const schedule = require('node-schedule');
const moment = require('moment');
const timeConvert = require('../config/timeConvert');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const User = require('../model/User');

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
    let message = {
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
    let message = {
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
        }).populate('match_start_id').populate('match_join_id');

        pushes.forEach((push)=>{  
            let rule = new schedule.RecurrenceRule();
            rule.year = moment(push.rule).year();     
            rule.month = moment(push.rule).month();
            rule.date = moment(push.rule).date();
            rule.hour = moment(push.rule).hour();
            rule.minute = moment(push.rule).minute();
            rule.second = moment(push.rule).second();
            if(push.pushType == 'REVIEW'){
                schedule.scheduleJob(rule, () => pushNotificationUser(push.match_start_id._id,'FitMate 리뷰 알림!' ,`${push.match_join_id.user_nickname}님과의 운동은 어떻셨나요?`));
                schedule.scheduleJob(rule, () => pushNotificationUser(push.match_join_id._id, 'FitMate 리뷰 알림!', `${push.match_start_id.user_nickname}님과의 운동은 어떻셨나요?`));          
            }else if(push.pushType == 'GPS'){
                const data = {
                    "appointmentId":push.appointmentId,
                    "GPS": "GPS"
                  }
                schedule.scheduleJob(rule, () => pushDataUser(push.match_start_user, data));
                schedule.scheduleJob(rule, () => pushDataUser(push.match_join_user, data));
            }else{
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

module.exports = {pushNotificationUser, pushDataUser, pushChat, registerPush};