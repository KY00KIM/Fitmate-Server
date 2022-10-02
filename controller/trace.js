const { UserTrace } = require('../model/UserTrace');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');



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
        console.log("THIS CONTROLLER");
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
}


module.exports = traceController;