const { Location } = require('../model/Location');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');

const locationController = {
  /**
  * @path {GET} http://localhost:8000/v1/locations
  * @description 모든 지역(구) 단위를 조회하는 GET Method
  */
  getAllLocation: async (req, res) => {
    try {
      const location = await Location.find({});
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](location, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },
  /**
  * @path {GET} http://localhost:8000/v1/locations
  * @description 모든 지역(구) 단위를 조회하는 GET Method
  */
  getOneLocation: async (req, res) => {
    try {
      const location = await Location.find({});
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](location, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },

  /**
  * @params address ' '공백문자로 구분된 주소 문자열
  * @description 주소를 지역(구) 단위를 조회하여 ObjectId반환
  */
  parseAddress: async (address) => {
    let words = address.split(' ')
    let key = "서울특별시"
    words.forEach(async (word) => {
      const len = word.length
      if (word[len - 1] == '구') {
        key = word;
      }
    });
    let location = await Location.find({ location_name: key });
    const result = JSON.parse(JSON.stringify(location));
    if (location.length == 0) {
      let newLoc = await Location.create({ location_name: key });
      return newLoc._id
    }
    else
      return result[0]._id
  }
};

module.exports = locationController;