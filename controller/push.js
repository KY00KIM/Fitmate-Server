const admin = require('firebase-admin');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const User = require('../model/User');


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
        data: {
            data: Data
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

async function pushChat(req, res){
    try {
        const {
            params: { userId },
          } = req;
        const user = await User.findById(userId);
        if(!user){
            ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
            return;
        }
        pushNotification(userId.social.device_token, "Mate Chatting", "채팅이 도착했어요!");
        ResponseManager.getDefaultResponseHandler(res)['onSuccess'](user, 'SuccessOK', STATUS_CODE.SuccessOK);
      } catch (error) {
        ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
      }
}

module.exports = {pushNotification, pushData, pushChat};