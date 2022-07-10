const express = require("express");
const app = express();
const path = require("path");
const connect = require('./connection');
const router = require('./routes');
const { verifyUser } = require("./middleware/auth")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(verifyUser)

connect();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/', router)

const port = process.env.PORT || 8000


app.listen(port, () => {
    console.log(`Server Listening on ${port}`)
});