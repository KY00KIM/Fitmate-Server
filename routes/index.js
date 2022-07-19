const router = require("express").Router();

const user = require("./user");
const appointment = require("./appointment");
const review = require('./review');
const match = require('./match');
const post = require('./post');
const fitnesspart = require('./fitnesspart');
const location = require('./location');
const fitnesscenter = require('./fitnesscenter');
const push = require('./push');
const qrcode = require('./qrcode');

const { swaggerUi, specs } = require("../docs/swagger");


const {uploadProfileImage} = require('../config/aws_s3');
const path = require('path');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 유저 추가 수정 삭제 조회
 */


router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
// router.use("/api/user", user);
router.use("/v1/users", user);
router.use("/v1/appointments", appointment);
router.use("/v1/reviews", review);
router.use("/v1/matching", match);
router.use("/v1/posts", post);
router.use("/v1/fitnesspart", fitnesspart);
router.use("/v1/locations", location);
router.use("/v1/fitnesscenters", fitnesscenter);
router.use("/v1/push", push);
router.use("/v1/qrcode", qrcode);

router.get("/", (req, res) => {
    const result = uploadProfileImage(path.join(__dirname, '../algorithm.jpg'), 1234);
    console.log(result);
    res.send(result)
})

module.exports = router