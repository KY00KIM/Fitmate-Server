const v1Router = require("express").Router();

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
const path = require('path');
const { uploadProfileImage } = require('../../config/aws_s3');
const { swaggerUi, specs } = require("../../docs/swagger");


v1Router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
v1Router.use("/users", user);
v1Router.use("/appointments", appointment);
v1Router.use("/reviews", review);
v1Router.use("/matching", match);
v1Router.use("/posts", post);
v1Router.use("/fitnesspart", fitnesspart);
v1Router.use("/locations", location);
v1Router.use("/fitnesscenters", fitnesscenter);
v1Router.use("/push", push);
v1Router.use("/chats", chat);
v1Router.use("/report", report);
v1Router.use("/trace", trace);

v1Router.get("/", async (req, res) => {
    console.log('Success Connected');
});

module.exports = v1Router