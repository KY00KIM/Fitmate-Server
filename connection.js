const mongoose = require('mongoose');
require("dotenv").config();

const connect = () => {
    if(process.env.NODE_ENV !== 'production'){
        mongoose.set('debug', true);
    }
    // Local
    // const url = `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}/${process.env.MONGO_DB}?authSource=admin`;
    
    // Atlas
    const url = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@fitmate.ein72.mongodb.net/?retryWrites=true&w=majority`
    mongoose.connect(url, {
        dbName: 'FitMate',
        // useNewUrlParser: true,
        // useCreateIndex: true,
    },(error) =>{
        if(error){
            console.log('MongoDB Connection Error', error);
        }else{
            console.log('MongoDB Connection Success');
        }
    });
};


mongoose.connection.on('error', (error) =>{
    console.log('MongoDB Connection Error', error);
});

mongoose.connection.on('disconnected', () =>{
    console.log('MongoDB DisConnected...ReConnecting...');
    connect();
});

module.exports = connect;