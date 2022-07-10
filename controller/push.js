// To Firebase
const admin = require('firebase-admin');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');

// 1.채팅: 채팅 오면 알림 전송 -> 바로
// 2.리뷰: 자정에 약속 탐색 -> 12:00에 리뷰 작성 알림 요청
// 3.위치정보: FE에 GPS 정보 요청 
const pushController = {
    pushAlarm: async (req, res) => {
        let deviceToken =`토큰값입력`
	
        let message = {
            notification: {
                title: '테스트 발송',
                body: 'FitMate 앱 확인해보세요!',
            },
            token: deviceToken,
        }
        admin
        .messaging()
        .send(message)
        .then(function (response) {
            console.log('Successfully sent message: : ', response)
            return res.status(200).json({success : true})
        })
        .catch(function (err) {
            console.log('Error Sending message!!! : ', err)
            return res.status(400).json({success : false})
        });
    }
};