/*
Link: https://www.npmjs.com/package/status-code-enum
Example: res.statusCode = StatusCode.ClientErrorBadRequest
*/

const { StatusCode } = require('status-code-enum')
const STATUS_CODE = {
    
    // OK 200
    SuccessOK: StatusCode.SuccessOK,
    // Created 201
    SuccessCreated: StatusCode.SuccessCreated,    
    // // Accepted 202
    // SuccessAccepted: StatusCode.SuccessAccepted,    
    // No Content 204
    SuccessNoContent: StatusCode.SuccessNoContent,

    // Bad Request 400
    ClientErrorBadRequest: StatusCode.ClientErrorBadRequest,
    // Unauthorized 401: JWT, Oauth
    ClientErrorUnauthorized: StatusCode.ClientErrorUnauthorized,
    // Forbidden 403: 접근 권한 부족 
    ClientErrorForbidden: StatusCode.ClientErrorForbidden,
    // Not Found 404
    ClientErrorNotFound:  StatusCode.ClientErrorNotFound,

    
    // SERVER ERROR 500
    ServerErrorInternal: StatusCode.ServerErrorInternal
}

module.exports = STATUS_CODE;