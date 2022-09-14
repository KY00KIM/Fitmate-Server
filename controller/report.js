const {ReportedPost} = require('../model/ReportedPost');
const {ReportedUser} = require('../model/ReportedUser');
const {Post} = require('../model/Post');
const {User} = require('../model/User');
require("dotenv").config();
const SlackNotify = require('slack-notify');
const MY_SLACK_WEBHOOK_URL = process.env.MY_SLACK_WEBHOOK_URL;
const slack = SlackNotify(MY_SLACK_WEBHOOK_URL);
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
            slack.send({
                channel: '#reports',
                text: `Report_user: ${JSON.stringify(user)} \nReported_post: ${JSON.stringify(post)}`,
                username:'FitMate'
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
            const user1 = await User.findById(req.user.id).lean();
            if(!user1){
                ResponseManager.getDefaultResponseHandler(res)['onError'](user1, 'NotFoundUser', STATUS_CODE.ClientErrorBadRequest);
                return;
            }
            const user2 = await User.findById(req.body.reported_user).lean();
            if(!user2){
                ResponseManager.getDefaultResponseHandler(res)['onError'](user2, 'NotFoundUser', STATUS_CODE.ClientErrorBadRequest);
                return;
            }
            const result = await ReportedUser.create({
                'report_user': req.user.id,
                'reported_user': req.body.reported_user,
                'reported_content': req.body.reported_content,
            });
            slack.send({
                channel: '#reports',
                text: `Report_user: ${JSON.stringify(user1)} \nReported_user: ${JSON.stringify(user2)} \nReported_content: ${req.body.reported_content}`,
                username:'FitMate'
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