const { FitnessCenter } = require('../model/FitnessCenter');
const { User } = require('../model/User');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const locationController = require('./location')
const {Post} = require("../model/Post");
const {ObjectId} = require("mongodb");

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
          kakao_url: fitness_center.place_url
        });
        return newCenter._id
      }
    } catch (e) {
      console.log("error in fitness center : " + e)
    }

  },
  writeOneFitnessCenter: async (req, res) => {
    try {
      console.log(req.body);
      const results = await FitnessCenter.find({'center_address':req.body.center_address});
      if(results.len >= 1){
        // 주소로 검색했을때 존재
        ResponseManager.getDefaultResponseHandler(res)['onSuccess'](results, 'Duplicated', STATUS_CODE.SuccessOK);

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
  countUsersByFitnessCenter: async (req, res) => {
    try {

      let { page, limit = 10 } = req.query;
      if (page) {
        page = parseInt(req.query.page);
      }
      else {
        page = 1;
        // Should Change
        limit = 10;
      };

      const options = {
        page: page,
        limit: limit
      };
      var aggregate = await User.aggregate([
        { "$group": {
            "_id": '$fitness_center_id',
            "userCount": { "$sum": 1 }
          }},

        { "$sort": { "userCount": -1 } }
      ]);
      if(req.query.first_longitude && req.query.first_latitude && req.query.second_longitude && req.query.second_latitude){
        const first_longitude = parseInt(req.query.first_longitude);
        const second_longitude = parseInt(req.query.second_longitude);
        const first_latitude = parseInt(req.query.first_latitude);
        const second_latitude = parseInt(req.query.second_latitude);
        if(first_latitude > second_latitude || first_longitude > second_longitude){
          return ResponseManager.getDefaultResponseHandler(res)['onError'](
              {first_latitude, second_latitude, first_longitude, second_longitude},
              'first is bigger than second', STATUS_CODE.ClientErrorBadRequest
          );
        }
        const result = await FitnessCenter.aggregatePaginate({$and: [
            {"fitness_longitude": {"gte":first_longitude}},
            {"fitness_longitude": {"lte":second_longitude}},
            {"fitness_latitude": {"gte":first_latitude}},
            {"fitness_latitude": {"lte":second_latitude}}
          ]}, options);

        result.userCount = [];
        result.docs.forEach((fitnessCenter) => {
          const searchResult = aggregate.find(o => o._id == fitnessCenter._id);
          if(searchResult){
            result.userCount.push({'centerId':searchResult['_id'], 'counts':searchResult['userCount']});
          }else{
            result.userCount.push({'centerId': fitnessCenter._id, 'counts': 0})
          }
        });
        ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessOK', STATUS_CODE.SuccessOK);
      }else{
        const result = await FitnessCenter.aggregatePaginate(aggregate, options);

        result.userCount = [];
        result.docs.forEach((fitnessCenter) => {
          const searchResult = aggregate.find(o => o._id == fitnessCenter._id);
          if(searchResult){
            result.userCount.push({'centerId':searchResult['_id'], 'counts':searchResult['userCount']});
          }else{
            result.userCount.push({'centerId': fitnessCenter._id, 'counts': 0})
          }
        });
        ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessOK', STATUS_CODE.SuccessOK);
       }
    }catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'Fitness Center Error', STATUS_CODE.ClientErrorBadRequest);
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
  deleteFitnessCenterByKeyWord: async (req, res) => {
    try{
      const result = await FitnessCenter.find();
      for(const center of result){
        if(center.fitness_latitude > center.fitness_longitude){
          await FitnessCenter.findByIdAndUpdate(center._id, {
            fitness_latitude:center.fitness_longitude,
            fitness_longitude:center.fitness_latitude,
          })
        }
      }
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessCreated', STATUS_CODE.SuccessCreated);
    }catch(error){
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },
  searchFitnessCenter: async (req, res) => {
    try{
      let { page, limit = 10 } = req.query;
      if (page) {
        page = parseInt(req.query.page);
      }
      else {
        page = 1;
        // Should Change
        limit = 10;
      };

      const options = {
        page: page,
        limit: limit
      };
      const keyWord = req.query.keyWord;
      if(keyWord){
        await FitnessCenter.paginate({$text: {$search: keyWord}}, options, (err, result)=>{
          ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessOK', STATUS_CODE.SuccessOK);
        });
      }else{
        ResponseManager.getDefaultResponseHandler(res)['onSuccess']([], 'NO KEYWORD!', STATUS_CODE.SuccessNoContent);
      }
    }catch(error){
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  }
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