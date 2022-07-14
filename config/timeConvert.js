const moment = require('moment');

const timeConvert = {
    addNineHours:(date) => {
        // console.log("Added 9 hours");
        return moment(date).add('9','h').format('YYYY-MM-DD HH:mm:ss');
    },
    subtractNineHours: (date) => {
        // console.log("Subtract 9 hours");
        return moment(date).subtract('9','h').format('YYYY-MM-DD HH:mm:ss');
    },
    convertZeroHours: (date) => {
        // console.log("Add 0 hours");
        return moment(date).add('0','h').format('YYYY-MM-DD HH:mm:ss');
    }
}

module.exports = timeConvert;