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
      const locations = await Location.find({}).lean();
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](locations, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },
  getOneLocation: async (req, res) => {
    try {
      const { locId } = req.params
      const location = await Location.findById(locId).lean();
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](location, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },

  parseAddress: async (address) => {
    let words = address.split(' ');
    let key = "강남구";
    if (words.length > 2) {
      key = words[1];
    } else {
      words.forEach(async (word) => {
        const len = word.length
        if (word[len - 1] == '구') {
          key = word;
        }
      });
    }
    try {
      let locations = await Location.find({ location_name: key });
      if (locations.length == 0) {
        let newLoc = await Location.create({ location_name: key });

        return newLoc._id
      }
      else {
        return locations[0]._id
      }
    } catch (e) {
      console.log("error in address : " + e)
      return null
    }
  },
  updateOneLocation: async (req, res) => {
    try {
      const { locId } = req.params;
      const location = await Location.findByIdAndUpdate(locId, {
        location_longitude:req.body.location_longitude,
        location_latitude: req.body.location_latitude
      });
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](location, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      console.log(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },
};

module.exports = locationController;