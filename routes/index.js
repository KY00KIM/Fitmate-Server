const router = require("express").Router();
const v1Router = require('./v1')
const { verifyUser } = require("..//middleware/auth");


router.get('/', (req, res) => {
    res.send("<h3 style=\"text-align:center\" >HI I'M ROOT '/' PAGE </h3>")
})

router.use('/v1', verifyUser, v1Router);


module.exports = router