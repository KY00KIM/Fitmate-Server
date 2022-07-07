const router = require("express").Router();
const user = require("./user");
const appointment = require("./appointment");
const review = require('./review');
const match = require('./match');
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

router.get("/", (req, res) => {
    res.send("Hello World")
})

module.exports = router