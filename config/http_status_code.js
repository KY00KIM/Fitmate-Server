/*
Link: https://www.npmjs.com/package/status-code-enum
Example: res.statusCode = StatusCode.ClientErrorBadRequest

public enum BaseResponseStatus {

    SUCCESS(true,"요청 성공", "200"),
    REQUEST_ERROR(false,"입력값을 확인해주세요.", "401"),
    EMPTY_JWT(false,"JWT를 입력해주세요.", "401"),
    INVALID_JWT(false, "유효하지 않은 JWT입니다.", "401"),
    INVALID_USER_JWT(false,"권한이 없는 유저의 접근입니다.", "401"),
    DUPLICATE_USER_EMAIL(false, "중복된 이메일입니다", "401"),
    DUPLICATE_USER_NICKNAME(false, "중복된 닉네임입니다", "401"),
    PASSWORD_NOT_MATCH(false, "비밀번호가 일치하지 않습니다", "401"),
    DATABASE_ERROR(false, "데이터베이스 연결에 실패하였습니다.", "400"),
    SERVER_ERROR(false, "서버와의 연결에 실패하였습니다.", "400"),


    PASSWORD_ENCRYPTION_ERROR(false, "비밀번호 암호화에 실패하였습니다.", "400"),
    PASSWORD_DECRYPTION_ERROR(false, "비밀번호 복호화에 실패하였습니다.","400"),


    NO_TREND_LIST_ERROR(false, "트렌드 데이터가 없습니다.","400"),
    ACTIVITY_IDX_ERROR(false, "존재하지 않는 엑티비티입니다.", "400"),
    INVALID_USER_IDX(false, "존재하지 않는 User입니다.", "400"),
    INVALID_PREFERENCE(false, "사용자 선호도가 없습니다.", "400"),
    PREFERENCE_LACK_ERROR(false, "사용자 선호도 데이터가 부족합니다.", "400"),
    MEDIA_DATA_LACK_ERROR(false, "해당 미디어는 개봉 전이거나 데이터가 충분하지 않습니다.", "400");

    private final boolean isSuccess;
    private final String message;
    private final String status;

    private BaseResponseStatus(boolean isSuccess, String message, String status) {
        this.isSuccess = isSuccess;
        this.message = message;
        this.status = status;
    }
}
*/

const { StatusCode } = require('status-code-enum')
const STATUS_CODE = {
    
    // SUCCESS 200
    SUCCESS_OK: StatusCode.SuccessOK,


    // USER 
    INVALID_USER_IDX: StatusCode.ClientErrorNotFound,
    INVALID_USER: StatusCode.ClientErrorUnauthorized,
    EMPTY_JWT: StatusCode.ClientErrorUnauthorized,
    INVALID_JWT:  StatusCode.ClientErrorUnauthorized,

    // FITNESS CENTER
    INVALID_FITNESS_CENTER: StatusCode.ClientErrorNotFound,

    // SERVER ERROR
    INTERNEL_SERVER_ERROR: StatusCode.ServerErrorInternal
}

module.exports = STATUS_CODE;