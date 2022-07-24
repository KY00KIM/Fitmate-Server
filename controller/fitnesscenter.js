const { FitnessCenter } = require('../model/FitnessCenter');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const locationController = require('./location')

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
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },
  /**
  * @path {GET} http://fitmate.co.kr/v1/fitnesscenters/:fitnesscenterId
  * @description 특정 운동 센터를 조회하는 GET Method
  */
  getOneFitnessCenter: async (req, res) => {
    try {
      const { fitnesscenterId } = req.params;
      const fitnesscenter = await FitnessCenter.findById(fitnesscenterId);
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](fitnesscenter, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },

  writeOneFitnessCenter: async (req, res) => {
    try {
      const fitnesscenterId = await getFitnessCenterId(req.body);
      const fitnesscenter = await FitnessCenter.findById(fitnesscenterId);
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](fitnesscenter, 'SuccessCreated', STATUS_CODE.SuccessCreated);
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },


  getFitnessCenterId: async (fitness_center) => {
    const fitnessCenter = await FitnessCenter.find({ center_name: fitness_center.center_name, center_address: fitness_center.center_address });
    let res = JSON.parse(JSON.stringify(fitnessCenter))
    if (fitnessCenter.length != 0) {
      return res[0]._id
    }
    else {
      const locId = await locationController.parseAddress(fitness_center.center_address)
      let newCenter = await FitnessCenter.create({
        center_name: fitness_center.center_name,
        center_address: fitness_center.center_address,
        center_location: locId,
        fitness_longitude: fitness_center.fitness_longitude,
        fitness_latitude: fitness_center.fitness_latitude
      });
      newCenter = newCenter.toJSON();
      console.dir(newCenter)
      return newCenter._id
    }

  },

};

module.exports = fitnesscenterController;