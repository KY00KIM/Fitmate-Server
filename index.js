const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const router = require('./routes')





app.use('/', router)

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server Listening on ${port}`)
});