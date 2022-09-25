const { FitnessCenter } = require('../model/FitnessCenter');
const { User } = require('../model/User');
const { FitnessCenterReview } = require('../model/FitnessCenterReview');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const locationController = require('./location')
const {Post} = require("../model/Post");
const {ObjectId} = require("mongodb");
const {token} = require("morgan");

const fitnesscenterController = {
  /**
  * @path {GET} http://localhost:8000/v1/fitnesscenters
  * @description 모든 운동 센터를 조회하는 GET Method
  */
  getAllFitnessCenter: async (req, res) => {
    try {
      const fitnesscenters = await FitnessCenter.find({}).lean();
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
      const fitnesscenter = await FitnessCenter.findById(fitnesscenterId).lean();
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](fitnesscenter, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },
  getFitnessCenterByAddress: async (req, res) => {
    try{
      const address = req.body.address;
      const fitness_centers = await FitnessCenter.find({"center_address":address}).lean();
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
        const locId = await locationController.parseAddress(fitness_center.center_address);
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
        const {
            center_name, center_address,fitness_longitude,fitness_latitude, kakao_url
        } = req.body;
      const locId = await locationController.parseAddress(center_address);
      const result = await FitnessCenter.create({
        center_name: center_name,
        center_address: center_address,
        center_location: locId,
        fitness_longitude: fitness_longitude,
        fitness_latitude: fitness_latitude,
        kakao_url: kakao_url
      });
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessCreated', STATUS_CODE.SuccessCreated);
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
        const first_longitude = parseFloat(req.query.first_longitude);
        const second_longitude = parseFloat(req.query.second_longitude);
        const first_latitude = parseFloat(req.query.first_latitude);
        const second_latitude = parseFloat(req.query.second_latitude);
        console.log(first_latitude, second_latitude, first_longitude, second_longitude);
        if(first_latitude > second_latitude || first_longitude > second_longitude){
          return ResponseManager.getDefaultResponseHandler(res)['onError'](
              {first_latitude, second_latitude, first_longitude, second_longitude},
              'first is bigger than second', STATUS_CODE.ClientErrorBadRequest
          );
        }
        let result = await FitnessCenter.paginate(
            {$and: [
              {fitness_longitude: {$gt: first_longitude}},
              {fitness_longitude: {$lt: second_longitude}},
              {fitness_latitude: {$gt:first_latitude}},
              {fitness_latitude: {$lt:second_latitude}}
          ]}, options);
        result.userCount = [];
        for(let i = 0; i < result.docs.length; ++i){
          result.docs[i] = result.docs[i].toObject();
          let fitnessCenter = result.docs[i];
          let reviews = await FitnessCenterReview.find({center_id: fitnessCenter._id});

          if(reviews){
            result.docs[i].reviews = reviews;
          }else{
            result.docs[i].reviews = [];
          }
          const searchResult = aggregate.find(o => o._id == fitnessCenter._id);
          if(searchResult){
            result.userCount.push({'centerId':searchResult['_id'], 'counts':searchResult['userCount']});
          }else{
            result.userCount.push({'centerId': fitnessCenter._id, 'counts': 0})
          }
        };

        ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessOK', STATUS_CODE.SuccessOK);
      }else{
        let result = await FitnessCenter.aggregatePaginate(aggregate, options);

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
      const result = await FitnessCenter.deleteMany({center_name: {$regex: req.params.keyWord}});
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
        if(keyWord.length < 2){
          ResponseManager.getDefaultResponseHandler(res)['onError'](keyWord, '두 글자 이상 검색해주세요!', STATUS_CODE.ClientErrorBadRequest);
          return;
        }
        let tokens = keyWord.split(' ');
        if(tokens.length > 1){
          await FitnessCenter.paginate(
              {$text: {$search: keyWord}},
              options, (err, result)=>{
                ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessOK', STATUS_CODE.SuccessOK);
          });
        }else{
          await FitnessCenter.paginate(
              {$text: {$search: keyWord}},
              options, (err, result)=>{
                ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessOK', STATUS_CODE.SuccessOK);
              });
        }
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