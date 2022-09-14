const {ReportedPost} = require('../model/ReportedPost');
const {ReportedUser} = require('../model/ReportedUser');
const {Post} = require('../model/Post');
const {User} = require('../model/User');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');


const reportController = {
    /**
    * @path {POST} http://fitmate.co.kr/v1/report/:postId
    * @description POST를 신고하는 POST Method
    */
    reportPost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId).lean();
            if(!post){
                ResponseManager.getDefaultResponseHandler(res)['onError'](post, 'NotFoundPost', STATUS_CODE.ClientErrorBadRequest);
                return;
            }            
            const user = await User.findById(req.user.id).lean();
            if(!user){ 
                ResponseManager.getDefaultResponseHandler(res)['onError'](user, 'NotFoundUser', STATUS_CODE.ClientErrorBadRequest);
                return;
            }
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
    * @path {POST} http://fitmate.co.kr/v1/report/users
    * @description 사용자를 신고하는 POST Method
    */
    reportUser: async (req, res) => {
        try {
            const result = await ReportedUser.create({
                'report_user': req.user.id,
                'reported_user': req.body.reported_user,
                'reported_content': req.body.reported_content,
            });
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessCreated', STATUS_CODE.SuccessCreated);
            } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    /**
    * @path {GET} http://fitmate.co.kr/v1/report/posts
    * @description 모든 모집글 신고 내역을 보는 GET Method
    */
     getAllPostReport: async (req, res) => {
        try {
            const reports = await ReportedPost.find().lean();
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](reports, 'SuccessCreated', STATUS_CODE.SuccessCreated);
            } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },    
    /**
    * @path {GET} http://fitmate.co.kr/v1/report/users
    * @description 모든 사용자 신고 내역을 보는 GET Method
    */
     getAllUserReport: async (req, res) => {
        try {
            const reports = await ReportedUser.find().lean();
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](reports, 'SuccessCreated', STATUS_CODE.SuccessCreated);
            } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
};
module.exports = reportController;