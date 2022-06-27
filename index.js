const express = require("express");
const app = express();
const path = require("path");
const config = require('./config/config');

const mongoose = require("mongoose");


let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    console.log('Connected to MongoDB');
    server = app.listen(config.port, () => {
        console.log(`Listening to port ${config.port}`);
    });
});



const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server Listening on ${port}`)
});