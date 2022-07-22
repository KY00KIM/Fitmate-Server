const router = require("express").Router();
const v1Router = require('./v1')
const { verifyUser } = require("../middleware/auth");

router.get('/', (req, res) => {
    res.render('./view/landing-02-image-bg.html');
})
router.use('/v1', verifyUser, v1Router);


module.exports = router