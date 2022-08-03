const admin = require('firebase-admin');
const schedule = require('node-schedule');
const moment = require('moment');
const timeConvert = require('../config/timeConvert');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const User = require('../model/User');

const { PushSchedule } = require('../model/PushSchedule');


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

            if(push.pushType === 'REVIEW'){
                schedule.scheduleJob(rule, () => pushNotification(push.match_start_id.social.device_token,'FitMate 리뷰 알림!' ,`${push.match_join_id.user_nickname}님과의 운동은 어떻셨나요?`));
                schedule.scheduleJob(rule, () => pushNotification(push.match_join_id.social.device_token, 'FitMate 리뷰 알림!', `${push.match_start_id.user_nickname}님과의 운동은 어떻셨나요?`));          
            }else if(push.pushType === 'GPS'){
                data = {
                    "appointmentId":push.appointmentId,
                    "GPS": "GPS"
                  }
                schedule.scheduleJob(rule, () => pushData(push.match_start_user.social.device_token, data)
                );
                schedule.scheduleJob(rule,() => pushData(push.match_join_user.social.device_token, data));
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
        const user = await User.findById(userId);
        pushNotification(userId.social.device_token, "Mate Chatting", "채팅이 도착했어요!");
        ResponseManager.getDefaultResponseHandler(res)['onSuccess'](user, 'SuccessOK', STATUS_CODE.SuccessOK);
      } catch (error) {
        ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
      }
};

module.exports = {pushNotification, pushData, pushChat, registerPush};