const { Appointment } = require('../model/Appointment');
const { User } = require('../model/User');
const { UserTrace } = require('../model/UserTrace');
const { pushData } = require('./push');
const schedule = require('node-schedule');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const e = require('express');
const { now } = require('mongoose');

const matchController = {
    /**
    * @path {POST} http://fitmate.co.kr/v1/matching/:appointmentId
    * @description 사용자들의 매칭 여부를 확인하는 POST Method
    */
    checkMatching: async (req, res) => {
        try {
            const {
                params: { appointmentId },
                body: { user_1, user_2 }
            } = req
            const distance = getDistanceFromLatLonInKm(user_1.user_latitude, user_1.user_longitude, user_2.user_latitude, user_2.user_longitude);
            await UserTrace.create({
                'user_id': user_1.user_id,
                'user_longitude': user_1.user_longitude || 126.97,
                'user_latitude': user_1.user_latitude || 37.56
            });
            await UserTrace.create({
                'user_id': user_2.user_id,
                'user_longitude': user_2.user_longitude || 126.97,
                'user_latitude': user_2.user_latitude || 37.56
            });
            if (distance <= 1) {
                const appointment = await Appointment.findByIdAndUpdate(appointmentId, { match_succeeded: true }, { new: true, runValidators: true });
                ResponseManager.getDefaultResponseHandler(res)['onSuccess'](appointment, 'SuccessOK', STATUS_CODE.SuccessOK);
            }
            else {
                const appointment = await Appointment.findByIdAndUpdate(appointmentId, { match_succeeded: false }, { new: true, runValidators: true });
                data = {
                    "appointmentId": appointment._id,
                    Type: "QRCODE"
                };

                let rule = new schedule.RecurrenceRule();
                const now_date = Date.now();

                rule.year = moment(now_date).year();
                rule.month = moment(now_date).month() + 1;
                rule.date = moment(now_date).date();
                rule.hour = moment(now_date).hour();
                rule.minute = moment(now_date).minute() + 5;
                rule.second = moment(now_date).second();

                const match_start_user = await User.findById(user_1.user_id);
                const match_join_user = await User.findById(user_2.user_id);

                match_start_user.social.device_token.forEach((deviceToken) => {
                    schedule.scheduleJob(rule, () => pushData(deviceToken, data));
                });
                match_join_user.social.device_token.forEach((deviceToken) => {
                    schedule.scheduleJob(rule, () => pushData(deviceToken, data));
                });
                ResponseManager.getDefaultResponseHandler(res)['onSuccess'](appointment, 'SuccessOK', STATUS_CODE.SuccessOK);
            }
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },

    getDistanceFromLatLonInKm: (lat1, lng1, lat2, lng2) => {
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
    },


    getDistanceBetweenUsersInKm: async (user_id1, user_id2) => {
        const user_1 = await User.findById(user_id1);
        const user_2 = await User.findById(user_id2);
        return getDistanceFromLatLonInKm(user_1.user_latitude, user_1.user_longitude, user_2.user_latitude, user_2.user_longitude)
    }
};



module.exports = matchController;