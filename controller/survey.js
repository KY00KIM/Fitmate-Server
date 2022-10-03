const {SurveyCandidates} = require('../model/SurveyCandidates');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const {User} = require('../model/User');

const surveyController = {
    getAllSurveyCandidates: async (req, res) => {
        try {
            const candidates = await SurveyCandidates.find();
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](candidates, 'SuccessOK', STATUS_CODE.SuccessOK);
        } catch (error) {
            console.log(error);
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    createSurveyCandidates: async (req, res) => {
        try {
            const candidates = await SurveyCandidates.create({
                survey_content: req.body.survey_content
            });
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](candidates, 'SuccessOK', STATUS_CODE.SuccessOK);
        } catch (error) {
            console.log(error);
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    updateUserSurvey: async (req, res) =>{
        try{
            const result = await User.findByIdAndUpdate(req.user.id, {
                survey_content: req.body.survey_content
            });
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessOK', STATUS_CODE.SuccessOK);
        }catch(error){

        }
    }


};

module.exports = surveyController;