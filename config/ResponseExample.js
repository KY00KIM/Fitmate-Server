/*
const express = require("express");
const app = express();
const path = require("path");
const ResponseManager = require(path.join(__dirname,'response'));
const port = process.env.PORT || 8000

// Success 응답
app.get('/', (req, res) =>{
    ResponseManager.getDefaultResponseHandler(res)['onSuccess']('데이터', '메시지');
    console.log('Get Success 요청 성공');
});

//Error 응답
app.get('/about', (req, res) =>{
    ResponseManager.getDefaultResponseHandler(res)['onError']({});
    console.log('Get Error 요청 성공');
});

app.listen(port, () => {
    console.log(`Server Listening on ${port}`)
});
*/