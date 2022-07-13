const {Location} = require('../model/Location');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');

const locationController = {
    /**
    * @path {GET} http://localhost:8000/v1/locations
    * @description 모든 지역(구) 단위를 조회하는 GET Method
    */
    getAllLocation: async (req, res) =>{
        try {
            const location = await Location.find({});
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](location, 'SuccessOK', STATUS_CODE.SuccessOK);
          } catch (error) {
            console.log(error);
            ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
          }
    }
};

module.exports = locationController;