const { UserTrace } = require('../model/UserTrace');
const {User} = require('../model/User');
const MatchController = require('../controller/match');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const {FitnessCenter} = require("../model/FitnessCenter");



const traceController = {
    writeUserTrace: async (req, res) => {
        try {
            const { user_longitude, user_latitude, device } = req.body;
            const trace = await UserTrace.create({
                user_id: req.user.id,
                user_longitude: user_longitude,
                user_latitude: user_latitude,
                device: device
            });
            return ResponseManager.getDefaultResponseHandler(res)['onSuccess'](trace, 'SuccessOK', STATUS_CODE.SuccessOK);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    writeUserTraceNoAuth: async (req, res) => {
        try {
            const { user_longitude, user_latitude, user_id } = req.body;
            const trace = await UserTrace.create({
                user_id: user_id,
                user_longitude: user_longitude,
                user_latitude: user_latitude,
            });
            console.log("THIS OBJECT : " + trace);

            return ResponseManager.getDefaultResponseHandler(res)['onSuccess'](trace, 'SuccessOK', STATUS_CODE.SuccessOK);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    certificateUserTrace: async (req, res) => {
        try{
            const {
                fitnesscenterId,
                user_longitude,
                user_latitude
            } = req.body;
            const center = await FitnessCenter.findById(fitnesscenterId);
            const dist = MatchController.getDistanceFromLatLonInKm(user_longitude, user_latitude, center.fitness_longitude, center.fitness_latitude);
            if (dist < 1){
                await User.findByIdAndUpdate(req.user.id, {is_certificated: true});
                ResponseManager.getDefaultResponseHandler(res)['onSuccess']({is_certificated:true}, 'SuccessOK', STATUS_CODE.SuccessOK);
            }else{
                ResponseManager.getDefaultResponseHandler(res)['onSuccess']({is_certificated:false}, 'SuccessOK', STATUS_CODE.SuccessOK);
            }
        }catch(error){
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    }
}


module.exports = traceController;