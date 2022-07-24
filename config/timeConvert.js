const moment = require('moment');

const timeConvert = {
    addNineHours: (date) => {
        // console.log("Added 9 hours");
        return moment(date).add('9', 'h').format('YYYY-MM-DD HH:mm:ss');
    },
    subtractNineHours: (date) => {
        // console.log("Subtract 9 hours");
        return moment(date).subtract('9', 'h').format('YYYY-MM-DD HH:mm:ss');
    },
    convertZeroHours: (date) => {
        // console.log("Add 0 hours");
        return moment(date).add('0', 'h').format('YYYY-MM-DD HH:mm:ss');
    },
    differenceInMinutes: (date1, date2) => {
        const d1 = moment(date1);
        const d2 = moment(date2);
        return Math.abs(moment.duration(d1.diff(d2)).asMinutes());
    }
}

module.exports = timeConvert;