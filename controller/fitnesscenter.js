const { FitnessCenter } = require('../model/FitnessCenter');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');

const fitnesscenterController = {
  /**
  * @path {GET} http://localhost:8000/v1/fitnesscenters
  * @description 모든 운동 센터를 조회하는 GET Method
  */
  getAllFitnessCenter: async (req, res) => {
    try {
      const fitnesscenters = await FitnessCenter.find({});
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](fitnesscenters, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },
  /**
  * @path {GET} http://localhost:8000/v1/fitnesscenters/:fitnesscenterId
  * @description 특정 운동 센터를 조회하는 GET Method
  */
  getOneFitnessCenter: async (req, res) => {
    try {
      const {
        params: { fitnesscenterId },
      } = req;
      const fitnesscenter = await FitnessCenter.findById(fitnesscenterId);
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](fitnesscenter, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },

};

module.exports = fitnesscenterController;