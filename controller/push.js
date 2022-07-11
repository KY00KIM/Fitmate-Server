// To Firebase
const admin = require('firebase-admin');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');

// 1.채팅: 채팅 오면 알림 전송 -> 바로
// 2.리뷰: 자정에 약속 탐색 -> 12:00에 리뷰 작성 알림 요청
// 3.위치정보: FE에 GPS 정보 요청 

async function pushAlarm(deviceToken="디바이스 토큰값", TITLE="No Title", BODY="No Body"){
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
        .then(function (response) {
            console.log('Successfully sent message: : ', response)
            return res.status(200).json({success : true});
        })
        .catch(function (err) {
            console.log('Error Sending message!!! : ', err)
            return res.status(400).json({success : false})
    });
}
