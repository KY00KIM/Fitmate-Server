const v2Router = require("express").Router();

const banner = require('./banner');
const post = require('./post');
const fitnesscenter = require('./fitnesscenter');
const path = require('path');
const { uploadProfileImage } = require('../../config/aws_s3');
const { swaggerUi, specs } = require("../../docs/swagger");


v2Router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
v2Router.use("/banner", banner);
v2Router.use("/post", banner);
v2Router.use("/fitnesscenter", fitnesscenter);

v2Router.get("/", async (req, res) => {
    console.log('Success Connected');
});

module.exports = v2Router