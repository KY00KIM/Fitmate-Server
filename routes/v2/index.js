const v2Router = require("express").Router();
const user = require("./user");
const appointment = require("./appointment");
const review = require('./review');
const match = require('./match');
const post = require('./post');
const fitnesspart = require('./fitnesspart');
const location = require('./location');
const fitnesscenter = require('./fitnesscenter');
const push = require('./push');
const chat = require('./chat');
const report = require('./report');
const trace = require('./trace');
const visitor = require('./visitor');
const { swaggerUi, specs } = require("../../docs/swagger");
const banner = require('./banner');
const path = require('path');
const { verifyUser } = require("../../middleware/auth");
const { uploadProfileImage } = require('../../config/aws_s3');


v2Router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
v2Router.use("/banner", banner);
v2Router.use("/post", post);
v2Router.use("/fitnesscenters",verifyUser, fitnesscenter);
v2Router.use("/users", user);
v2Router.use("/appointments", appointment);
v2Router.use("/reviews",verifyUser, review);
v2Router.use("/matching", match);
v2Router.use("/posts", post);
v2Router.use("/fitnesspart", fitnesspart);
v2Router.use("/locations", location);
v2Router.use("/push", push);
v2Router.use("/chats", chat);
v2Router.use("/report", report);
v2Router.use("/trace", trace);
v2Router.use("/visitor", visitor);

v2Router.get("/", async (req, res) => {
    console.log('Success Connected');
});

module.exports = v2Router;