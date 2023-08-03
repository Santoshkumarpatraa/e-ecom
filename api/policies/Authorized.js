var jwt = require("jsonwebtoken");

module.exports = {
  Authorized: async (req, res, next) => {
    let token;

    //Authenticate the token and check if token is valid.
    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];

        if (scheme === "Bearer") {
          token = credentials;
        }
      } else {
        return ResponseService.json(
          res,
          ConstantService.responseCode.UNAUTHORIZED,
          ConstantService.responseMessage.ERR_MSG_WRONG_FORMAT_AUTHORIZATION
        );
      }
    } else {
      return ResponseService.json(
        res,
        ConstantService.responseCode.UNAUTHORIZED,
        ConstantService.responseMessage.ERR_MSG_NO_HEADER_AUTHORIZATION
      );
    }

    try {
      const payload = await JwtService.verify(token);
      if (_.isEmpty(payload)) {
        return ResponseService.json(
          res,
          ConstantService.responseCode.UNAUTHORIZED,
          ConstantService.responseMessage.ERR_MSG_INVALID_SESSION
        );
      }
      req.accessToken = token;
      req.sessionData = payload;
      return next();
    } catch (exception) {
      console.log(exception);
      return ResponseService.json(
        res,
        ConstantService.responseCode.UNAUTHORIZED,
        ConstantService.responseMessage.ERR_MSG_INVALID_SESSION
      );
    }
  },
};
