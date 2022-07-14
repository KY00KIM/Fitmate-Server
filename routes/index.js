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

const { swaggerUi, specs } = require("../docs/swagger");

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

router.get("/", (req, res) => {
    res.send("Hello World")
})

module.exports = router