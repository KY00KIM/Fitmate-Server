const moment = require('moment');

function timeConvert(date){
    return moment(date).add('0','h').format('YYYY-MM-DD HH:mm:ss');
};

module.exports = {timeConvert};