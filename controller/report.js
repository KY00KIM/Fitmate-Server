const {ReportedPost} = require('../model/ReportedPost');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');


const reportController = {
    /**
    * @path {POST} http://fitmate.co.kr/v1/reports/:postId
    * @description POST를 신고하는 POST Method
    */
    reportPost: async (req, res) => {
        try {
            const result = await ReportedPost.create({
                'report_user': req.user.id,
                'reported_post': req.params.postId
            });
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessCreated', STATUS_CODE.SuccessCreated);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    /**
    * @path {POST} http://fitmate.co.kr/v1/reports/chatting
    * @description 채팅글을 신고하는 POST Method
    */
    reportChatting: async (req, res) => {
        try {
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](review, 'SuccessCreated', STATUS_CODE.SuccessCreated);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },

};
module.exports = reportController;