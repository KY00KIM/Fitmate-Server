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
            onError : function ( error ) {
                console.log('getDefaultResponseHandler onError');
                ResponseManager.respondWithError(res, error.status || 500, error.message || 'Unknown error');
            }
        }
    }
    static getDefaulterResponseHandlerData (res) {
        return {
            onSuccess : function ( data, message, code){
                ResponseManager.respondWithSuccess(res, code || ResponseManager.HTTP_STATUS.OK, data, message);
            },
            onError :function (error) {
                console.log('getDefaulterResponseHandlerData onError');
                ResponseManager.respondWithErrorData(res, error.status, error.message, error.data);
            }
        }
    }
    static getDefaultResponseHandlerError (res, successCallback){
        return {
            onSuccess:function (data, message, code){
                successCallback(data, message, code);
            },
            onError : function (error){
                console.log('getDefaultResponseHandlerError onError');
                ResponseManager.respondWithError(res, error.status || 500, error.message || 'Unknown error');
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
    static respondWithSuccess ( res, code, data, message="", links=[] ){
        let response = Object.assign({}, BasicResponse);
        response.success = true;
        response.message = message;
        response.data = data;
        response.links = links;
        res.status(code).json(response);
    }
    static respondWithErrorData (res, errorCode, message="", data="", llinks=[]) {
        console.log('ResponseManager respondWithErrorData');
        let response = Object.assign({}, BasicResponse);
        response.success = false;
        response.message = message;
        response.data = data;
        response.links = links;
        res.status(errorCode).json(response);
    }
    static respondWithError (res, errorCode, message="",links=[]) {
        console.log('ResponseManager respondWithError');
        let response = Object.assign({}, BasicResponse);
        response.success = false;
        response.message = message;
        response.links = links;
        res.status(errorCode).json(response);
    }
}
module.exports = ResponseManager;