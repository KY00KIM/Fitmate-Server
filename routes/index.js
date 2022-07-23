const router = require("express").Router();
const v1Router = require('./v1');
const path = require('path');
const { verifyUser } = require("..//middleware/auth");
const { UserTrace } = require('../model/UserTrace')
const { Appointment } = require('../model/Appointment')


router.post('/trace', async (req, res) => {
    console.log("body is " + req.body)
    const trace = await UserTrace.findByIdAndUpdate("62dba3394429bf0d32d3707d", req.body)
    res.send("DONE")
})
router.post('/trace1', async (req, res) => {
    console.log("body is " + req.body)
    const trace = await UserTrace.create(req.body)
    res.send("DONE")
})
router.get('/app', async (req, res) => {
    const user_id = "62c6697a4b8212e4674dbe14";
    const appointments = await Appointment.find({ appointment_date: { $lte: 1658601102030 } });
    console.log(appointments)
    console.log(" NUMBER : " + appointments.length)
    res.send("LIST DONE")
})

router.post('/app', async (req, res) => {
    const user_id1 = "62c66c2c4b8212e4674dbe17";
    const user_id2 = "62c66d3d4b8212e4674dbe18";

    const appointments = await Appointment.create({
        appointment_date: new Date('2022/7/24/04:00:00'),
        match_start_id: user_id1,
        match_join_id: user_id2
    });
    console.log(appointments)
    console.log(" NUMBER : " + appointments.length)
    res.send("LIST DONE")
})

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/landing-02-image-bg.html'));
})
router.use('/v1', verifyUser, v1Router);


module.exports = router