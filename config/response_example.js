/*
Link: https://www.npmjs.com/package/status-code-enum
*/

const express = require("express");
const app = express();
const path = require("path");
const ResponseManager = require(path.join(__dirname,'response'));
const STATUS_CODE = require(path.join(__dirname, 'http_status_code'));
const port = process.env.PORT || 8000

// Success 응답
app.get('/', (req, res) =>{
    ResponseManager.getDefaultResponseHandler(res)['onSuccess']('데이터', 'SUCCESS_OK', STATUS_CODE.SUCCESS_OK);
    console.log('Get Success 요청 성공');
});
// G
app.get('/set', (req, res) => {
    res.set('Content-Type', 'application/json');
})

//Error 응답
app.get('/error', (req, res) =>{
    ResponseManager.getDefaultResponseHandler(res)['onError']({});
    console.log('Get Error 요청 성공');
});

app.listen(port, () => {
    console.log(`Server Listening on ${port}`)
});
