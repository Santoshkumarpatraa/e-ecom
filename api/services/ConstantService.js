module.exports = {
    responseCode: {
        SUCCESS: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        INTERNAL_SERVER_ERROR: 500
    },
    source: {
        ANDROID: 'ANDROID',
        IOS: 'IOS',
        WEB: 'WEB'
    },
    responseMessage: {

        //Global
        ERR_OOPS_SOMETHING_WENT_WRONG: "Oops! Something wrong",

        //IsAuthorized
        ERR_MSG_WRONG_FORMAT_AUTHORIZATION: "Format is Authorization: Bearer [token]",
        ERR_MSG_NO_HEADER_AUTHORIZATION: "Please login to access this feature!",
        ERR_MSG_INVALID_SESSION: "Session expired! Please login again!",

        //AccountController Error
        ERR_MSG_ISSUE_IN_ACCOUNT_ADD_API: "Oops! Something went wrong in account add api!",
        ERR_MSG_ISSUE_IN_ACCOUNT_UPDATE_API: "Oops! Something went wrong in account update api!",
        ERR_MSG_ISSUE_IN_ACCOUNT_DELETE_API: "Oops! Something went wrong in account delete api!",
        ERR_MSG_ISSUE_IN_ACCOUNT_DETAILS_API: "Oops! Something went wrong in account details api!",
        ERR_MSG_ISSUE_IN_ACCOUNT_LOGIN_API: "Oops! Something went wrong in account login api!",
        ERR_MSG_ISSUE_IN_ACCOUNT_LOGOUT_API: "Oops! Something went wrong in account logout api!",

        //AccountController 
        ACCOUNT_ADDED_SUCCESS: "Account has been added successfully.",
        ACCOUNT_UPDATED_SUCCESS: "Account has been updated successfully.",
        ACCOUNT_DELETED_SUCCESS: "Account has been deleted successfully.",
        ACCOUNT_NOT_FOUND: "Account not found.",
        ACCOUNT_LOGIN_SUCCESS: "Account login successfully.",
        ACCOUNT_LOGOUT_SUCCESS: "Account logout successfully.",
        INVALID_CREDENTIALS: "Invalid Credentials.",
        ACCOUNT_ALREADY_EXISTS: "Account already exists",
        OTP_SENT: "Otp sent.",

    }
};