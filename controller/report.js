const {ReportedPost} = require('../model/ReportedPost');
const {ReportedUser} = require('../model/ReportedUser');
const {Post} = require('../model/Post');
const {User} = require('../model/User');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');


const reportController = {
    /**
    * @path {POST} http://fitmate.co.kr/v1/reports/:postId
    * @description POST를 신고하는 POST Method
    */
    reportPost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);
            if(!post){
                ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'NotFoundPost', STATUS_CODE.ClientErrorBadRequest);
                return;
            }            
            const user = await User.findById(req.user.id);
            if(!user){ 
                ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'NotFoundUser', STATUS_CODE.ClientErrorBadRequest);
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
    * @path {POST} http://fitmate.co.kr/v1/reports/user
    * @description 사용자를 신고하는 POST Method
    */
    reportUser: async (req, res) => {
        try {
            const result = await ReportedUser.findOne({'report_user':req.user.id});
            if(result){
                await result['reported_user'].push(req.body.reportedUserId);
                const newResult = await result.save();
                ResponseManager.getDefaultResponseHandler(res)['onSuccess'](newResult, 'SuccessCreated', STATUS_CODE.SuccessCreated);
                return;
            }else{
                const newResult = await ReportedUser.create({
                    'report_user': req.user.id,
                    'reported_user': [req.body.reportedUserId],
                }); 
                ResponseManager.getDefaultResponseHandler(res)['onSuccess'](newResult, 'SuccessCreated', STATUS_CODE.SuccessCreated);
                return;
            }
            } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },

};
module.exports = reportController;