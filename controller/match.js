const {Appointment} = require('../model/Appointment');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');

const matchController = {
    /**
    * @path {POST} http://localhost:8000/v1/matching
    * @description 사용자들의 매칭 여부를 확인하는 POST Method
    */
    checkMatching: async (req, res) =>{
        
    }
};

module.exports = matchController;