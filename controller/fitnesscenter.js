const { FitnessCenter } = require('../model/FitnessCenter');
const { User } = require('../model/User');
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
  getFitnessCenterByAddress: async (req, res) => {
    try{
      const address = req.body.address;
      const fitness_centers = await FitnessCenter.find({"center_address":address});
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](fitness_centers, 'SuccessOK', STATUS_CODE.SuccessOK);
    }catch(error){
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },
  getFitnessCenterId: async (fitness_center) => {
    try {
      const fitnessCenter = await FitnessCenter.find({ center_name: fitness_center.center_name, center_address: fitness_center.center_address });
      if (fitnessCenter.length != 0) {
        return fitnessCenter[0]._id
      }
      else {
        const locId = await locationController.parseAddress(fitness_center.center_address)
        let newCenter = await FitnessCenter.create({
          center_name: fitness_center.center_name,
          center_address: fitness_center.center_address,
          center_location: locId,
          fitness_longitude: fitness_center.fitness_longitude,
          fitness_latitude: fitness_center.fitness_latitude,
          kakao_url: fitness_center.place_url || ""
        });
        return newCenter._id
      }
    } catch (e) {
      console.log("error in fitness center : " + e)
    }

  },
  writeOneFitnessCenter: async (req, res) => {
    try {
      const results = await FitnessCenter.find({'center_address':req.body.center_address});
      if(results.len < 1){
        // 주소로 검색했을때 존재
        ResponseManager.getDefaultResponseHandler(res)['onSuccess'](results, 'Duplicated', STATUS_CODE.SuccessCreated);

      }else{
        // 주소로 존재하지 않음
        const fitnesscenterId = await getFitnessCenterId(req.body);
        const fitnesscenter = await FitnessCenter.findById(fitnesscenterId);
        ResponseManager.getDefaultResponseHandler(res)['onSuccess'](fitnesscenter, 'SuccessCreated', STATUS_CODE.SuccessCreated);

      }
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },
  countAllUsersbyFitenessCenter: async (req, res) => {
    try {
      const {
        params: { fitnesscenterId },
      } = req;
      const users = await User.find({fitnesscenterId:fitnesscenterId});
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](fitnesscenter, 'SuccessCreated', STATUS_CODE.SuccessCreated);
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },
  countUnMatchedPostsbyFitenessCenter: async (req, res) => {
    try {
      const {
        params: { fitnesscenterId },
      } = req;
      const fitnesscenter = await FitnessCenter.findById(fitnesscenterId);
      const users = await User.find({fitnesscenterId:fitnesscenterId});
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](fitnesscenter, 'SuccessCreated', STATUS_CODE.SuccessCreated);
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },
};
const  getFitnessCenterId = async (fitness_center) => {
  try {
    const fitnessCenter = await FitnessCenter.find({ center_name: fitness_center.center_name, center_address: fitness_center.center_address });
    if (fitnessCenter.length != 0) {
      return fitnessCenter[0]._id
    }
    else {
      const locId = await locationController.parseAddress(fitness_center.center_address)
      let newCenter = await FitnessCenter.create({
        center_name: fitness_center.center_name,
        center_address: fitness_center.center_address,
        center_location: locId,
        fitness_longitude: fitness_center.fitness_longitude,
        fitness_latitude: fitness_center.fitness_latitude,
        kakao_url: fitness_center.place_url || ""
      });
      return newCenter._id
    }
  } catch (e) {
    console.log("error in fitness center : " + e)
  }

}
module.exports = fitnesscenterController;