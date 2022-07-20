/*
REFERENCES
Example:    ./ReponseExample.js
Link:       https://www.tabnine.com/code/javascript/modules/http-status-codes
*/
const HttpStatus = require('http-status-codes');
const BasicResponse ={
    "success" : false,
    "message" : "",
    "data" : {}
};
const logger = require('./winston');
class ResponseManager {
    constructor (){
    }
    static get HTTP_STATUS () {
        return HttpStatus;
    }
    static getDefaultResponseHandler (res) {
        return {
            onSuccess: function ( data, message, code) {    
                ResponseManager.respondWithSuccess(res, code || ResponseManager.HTTP_STATUS.OK, data, message);
            },
            onError : function (error, message, code ) {
                console.log('getDefaultResponseHandler onError');
                ResponseManager.respondWithError(res, error , code || 500, message || 'Unknown error');
            }
        }
    }
    static getDefaulterResponseHandlerData (res) {
        return {
            onSuccess : function ( data, message, code){
                ResponseManager.respondWithSuccess(res, code || ResponseManager.HTTP_STATUS.OK, data, message);
            },
            onError :function (error, message, code ) {
                console.log('getDefaulterResponseHandlerData onError');
                ResponseManager.respondWithErrorData(res, error, code || 500 , message || 'Unknown error');
            }
        }
    }
    static getDefaultResponseHandlerError (res, successCallback){
        return {
            onSuccess:function (data, message, code){
                successCallback(data, message, code);
            },
            onError : function (message, code ){
                console.log('getDefaultResponseHandlerError onError');
                ResponseManager.respondWithError(res, code || 500, message || 'Unknown error');
            }
        }
    }
    static getDefaultResponseHandlerSuccess (res, errorCallback) {
        return {
            onSuccess : function (data, message, code){
                ResponseManager.respondWithSuccess(res, code || ResponseManager.HTTP_STATUS.OK, data, message);
            },
            onError: function(error){
                errorCallback(error);
            }
        }
    }
    static HATEOASLink ( link, method, rel) {
        return {
            link:link,
            method:method,
            rel:rel
        }
    }
    static respondWithSuccess ( res, code, data, message="" ){
        let response = Object.assign({}, BasicResponse);
        response.success = true;
        response.message = message;
        response.data = data;
        res.status(code).json(response);
    }
    static respondWithErrorData (res, error, errorCode, message="", data="") {
        console.log('ResponseManager respondWithErrorData');
        let response = Object.assign({}, BasicResponse);
        response.success = false;
        response.message = message;
        response.error = error;
        response.data = data;
        res.status(errorCode).json(response);
    }
    static respondWithError (res, error, errorCode, message="") {
        console.log('ResponseManager respondWithError');
        let response = Object.assign({}, BasicResponse);
        response.success = false;
        response.error = error;
        response.message = message;
        res.status(errorCode).json(response);
    }
}
module.exports = ResponseManager;