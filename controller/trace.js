const { UserTrace } = require('../model/UserTrace');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');



const traceController = {
    writeUserTrace: async (req, res) => {
        try {
            const { user_longitude, user_latitude } = req.body;
            const trace = await UserTrace.create({
                user_id: req.user.id,
                user_longitude: user_longitude,
                user_latitude: user_latitude,
            });
            return ResponseManager.getDefaultResponseHandler(res)['onSuccess'](trace, 'SuccessOK', STATUS_CODE.SuccessOK);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
}


module.exports = traceController;