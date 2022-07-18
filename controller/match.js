const { Appointment } = require('../model/Appointment');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');

const matchController = {
    /**
    * @path {POST} http://localhost:8000/v1/matching/:appointmentId
    * @description 사용자들의 매칭 여부를 확인하는 POST Method
    */
    checkMatching: async (req, res) => {
        try {
            const {
                params: { appointmentId },
                body: { user_1, user_2 }
            } = req
            const distance = getDistanceFromLatLonInKm(user_1.user_latitude, user_1.user_longitude, user_2.user_latitude, user_2.user_longitude);
            if (distance <= 1) {
                const appointment = await Appointment.findByIdAndUpdate(appointmentId, { match_succeeded: true }, { new: true, runValidators: true });
                ResponseManager.getDefaultResponseHandler(res)['onSuccess'](appointment, 'SuccessOK', STATUS_CODE.SuccessOK);
            }
            else {
                const appointment = await Appointment.findByIdAndUpdate(appointmentId, { match_succeeded: false }, { new: true, runValidators: true });
                ResponseManager.getDefaultResponseHandler(res)['onSuccess'](appointment, 'SuccessOK', STATUS_CODE.SuccessOK);
            }
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    }
};

function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

module.exports = matchController;