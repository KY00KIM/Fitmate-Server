const { Post } = require('../model/Post');
const {FitnessCenter} = require('../model/FitnessCenter');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');



const visitorController = {
    getPosts: async (req, res) => {
        try {
            return ResponseManager.getDefaultResponseHandler(res)['onSuccess'](trace, 'SuccessOK', STATUS_CODE.SuccessOK);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    getFitnessCenter: async (req, res) => {
        try{

        }catch(error){

        }
    }
}


module.exports = visitorController;