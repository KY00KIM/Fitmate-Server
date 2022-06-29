const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const router = require('./routes')

const mongoURI = 'mongodb+srv://new-user-1:qwer@kdev-shop.eufbp0j.mongodb.net/?retryWrites=true&w=majority'


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://user:1234@kdev-shop.eufbp0j.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(`mongoDB connected `)
//     }
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object

//     client.close();
// })
// try {
//     // Connect to the MongoDB cluster
//     mongoose.connect(
//         uri,
//         { useNewUrlParser: true, useUnifiedTopology: true },
//         () => console.log(" Mongoose is connected")
//     );

// } catch (e) {
//     console.log("could not connect");
// }


// const dbConnection = mongoose.connection;
// dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
// dbConnection.once("open", () => console.log("Connected to DB!"));

app.use('/', router)

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server Listening on ${port}`)
});