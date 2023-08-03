const Account = require("../models/Account");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  /**
   * Check if server is running.
   * API Endpoint :   /
   * API Method   :   GET
   *
   * @param   {Object}        req          Request Object From API Request.
   * @param   {Object}        res          Response Object For API Request.
   * @returns {Promise<*>}    JSONResponse With success code 200 and  information or relevant error code with message.
   */

  ping: async (req, res) => {
    res.status(200).send("OK");
  },

  /**
   * Create Account of user.
   * API Endpoint :   /user/add
   * API Method   :   POST
   *
   * @param   {Object}        req          Request Object From API Request.
   * @param   {Object}        res          Response Object For API Request.
   * @returns {Promise<*>}    JSONResponse With success code 200 and  information or relevant error code with message.
   */

  userAdd: async (req, res) => {
    try {
      console.info(
        "====================== ADD : ACCOUNT REQUEST ==============================\n"
      );
      console.info(
        "HTTP Method - " + req.method + "  |||||||||||  URL - " + req.url + "\n"
      );
      console.info("REQ BODY :", req.body);

      //Extracting account info from request body
      let request = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        contactNumber: req.body.contactNumber,
        image: req.body.image,
        roleType: req.body.roleType,
      };

      //Creating a Valid Schema for request.
      const schema = Joi.object().keys({
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        contactNumber: Joi.string().required(),
        image: Joi.string().allow(""),
        roleType: Joi.string().valid("user", "admin"),
      });

      //Validating Request with Valid schema.
      const validateResult = schema.validate(request);

      //Returning bad request for invalid request.
      if (validateResult.error) {
        return ResponseService.jsonResponse(
          res,
          ConstantService.responseCode.BAD_REQUEST,
          {
            message: validateResult.error.message,
          }
        );
      }

      let userId = uuidv4();

      //Encrypting Password
      const hashedPassword = await BcryptService.encryptedPassword(
        request.password
      );

      request.userId = userId;

      let account = await Account.create({
        userId: userId,
        name: `${request.firstName} ${request.lastName}`.trim(),
        email: request.email,
        contactNumber: request.contactNumber,
        password: hashedPassword,
        image: request.image,
        firstName: request.firstName,
        lastName: request.lastName,
        showProductTour: true,
        roleType: request.roleType,
      });

      account = _.omit(request, ["password"]);

      return ResponseService.jsonResponse(
        res,
        ConstantService.responseCode.SUCCESS,
        {
          message: ConstantService.responseMessage.ACCOUNT_ADDED_SUCCESS,
          data: {
            account: account,
          },
        }
      );
    } catch (exeception) {
      console.log(exeception);
      return ResponseService.json(
        res,
        ConstantService.responseCode.INTERNAL_SERVER_ERROR,
        ConstantService.responseMessage.ERR_MSG_ISSUE_IN_ACCOUNT_ADD_API
      );
    }
  },

  /**
   * Update Account of user.
   * API Endpoint :   /user/update
   * API Method   :   PUT
   *
   * @param   {Object}        req          Request Object From API Request.
   * @param   {Object}        res          Response Object For API Request.
   * @returns {Promise<*>}    JSONResponse With success code 200 and  information or relevant error code with message.
   */

  userUpdate: async (req, res) => {
    try {
      console.info(
        "====================== UPDATE : ACCOUNT REQUEST ==============================\n"
      );
      console.info(
        "HTTP Method - " + req.method + "  |||||||||||  URL - " + req.url + "\n"
      );
      console.info("REQ BODY :", req.body);

      //Extracting account info from request body
      let request = {
        userId: req.sessionData.userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        contactNumber: req.body.contactNumber,
        image: req.body.image,
      };

      //Creating a Valid Schema for request.
      const schema = Joi.object().keys({
        userId: Joi.string().required(),
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        email: Joi.string().required(),
        password: Joi.string().allow(""),
        contactNumber: Joi.string().required(),
        image: Joi.string().allow(""),
      });

      //Validating Request with Valid schema.
      const validateResult = schema.validate(request);

      //Returning bad request for invalid request.
      if (validateResult.error) {
        return ResponseService.jsonResponse(
          res,
          ConstantService.responseCode.BAD_REQUEST,
          {
            message: validateResult.error.message,
          }
        );
      }

      let accountExists = await Account.find({
        userId: request.userId,
        deletedAt: null,
      }).select("password");

      if (_.isEmpty(accountExists)) {
        return ResponseService.jsonResponse(
          res,
          ConstantService.responseCode.BAD_REQUEST,
          {
            message: ConstantService.responseMessage.ACCOUNT_NOT_FOUND,
          }
        );
      }

      //Encrypting Password
      if (!_.isEmpty(request.password)) {
        var hashedPassword = await BcryptService.encryptedPassword(
          request.password
        );
      } else {
        request = _.omit(request, ["password"]);
      }

      await Account.updateOne(
        { userId: request.userId },
        {
          firstName: request.firstName,
          lastName: request.lastName,
          name: `${request.firstName} ${request.lastName}`.trim(),
          email: request.email,
          image: request.image,
          contactNumber: request.contactNumber,
          password: request.password
            ? hashedPassword
            : `${accountExists[0].password}`,
        }
      );

      return ResponseService.jsonResponse(
        res,
        ConstantService.responseCode.SUCCESS,
        {
          message: ConstantService.responseMessage.ACCOUNT_UPDATED_SUCCESS,
          data: {
            account: request,
          },
        }
      );
    } catch (exeception) {
      console.log(exeception);
      return ResponseService.json(
        res,
        ConstantService.responseCode.INTERNAL_SERVER_ERROR,
        ConstantService.responseMessage.ERR_MSG_ISSUE_IN_ACCOUNT_UPDATE_API
      );
    }
  },

  /**
   * Delete Account of user.
   * API Endpoint :   /user/delete
   * API Method   :   DELETE
   *
   * @param   {Object}        req          Request Object From API Request.
   * @param   {Object}        res          Response Object For API Request.
   * @returns {Promise<*>}    JSONResponse With success code 200 and  information or relevant error code with message.
   */

  userDelete: async (req, res) => {
    try {
      console.info(
        "====================== DELETE : ACCOUNT REQUEST ==============================\n"
      );
      console.info(
        "HTTP Method - " + req.method + "  |||||||||||  URL - " + req.url + "\n"
      );
      console.info("REQ BODY :", req.query);

      //Extracting account info from request body
      let request = {
        userId: req.sessionData.userId,
      };

      //Creating a Valid Schema for request.
      const schema = Joi.object().keys({
        userId: Joi.string().required(),
      });

      //Validating Request with Valid schema.
      const validateResult = schema.validate(request);

      //Returning bad request for invalid request.
      if (validateResult.error) {
        return ResponseService.jsonResponse(
          res,
          ConstantService.responseCode.BAD_REQUEST,
          {
            message: validateResult.error.message,
          }
        );
      }

      let accountExists = await Account.find({
        userId: request.userId,
        deletedAt: null,
      });

      if (_.isEmpty(accountExists)) {
        return ResponseService.jsonResponse(
          res,
          ConstantService.responseCode.BAD_REQUEST,
          {
            message: ConstantService.responseMessage.ACCOUNT_NOT_FOUND,
          }
        );
      }

      await Account.deleteOne({ userId: request.userId });

      return ResponseService.jsonResponse(
        res,
        ConstantService.responseCode.SUCCESS,
        {
          message: ConstantService.responseMessage.ACCOUNT_DELETED_SUCCESS,
        }
      );
    } catch (exeception) {
      console.log(exeception);
      return ResponseService.json(
        res,
        ConstantService.responseCode.INTERNAL_SERVER_ERROR,
        ConstantService.responseMessage.ERR_MSG_ISSUE_IN_ACCOUNT_DELETE_API
      );
    }
  },

  /**
   * User Details.
   * API Endpoint :   /user/details
   * API Method   :   GET
   *
   * @param   {Object}        req          Request Object From API Request.
   * @param   {Object}        res          Response Object For API Request.
   * @returns {Promise<*>}    JSONResponse With success code 200 and  information or relevant error code with message.
   */

  userDetails: async (req, res) => {
    try {
      console.info(
        "====================== DETAILS : ACCOUNT REQUEST ==============================\n"
      );
      console.info(
        "HTTP Method - " + req.method + "  |||||||||||  URL - " + req.url + "\n"
      );
      console.info("REQ BODY :", req.query);

      //Extracting account info from request body
      let request = {
        userId: req.sessionData.userId,
      };

      //Creating a Valid Schema for request.
      const schema = Joi.object().keys({
        userId: Joi.string().required(),
      });

      //Validating Request with Valid schema.
      const validateResult = schema.validate(request);

      //Returning bad request for invalid request.
      if (validateResult.error) {
        return ResponseService.jsonResponse(
          res,
          ConstantService.responseCode.BAD_REQUEST,
          {
            message: validateResult.error.message,
          }
        );
      }

      let accountDetails = await Account.find({
        userId: request.userId,
        deletedAt: null,
      }).select(
        "firstName lastName name email image contactNumber showTour roleType userId"
      );

      if (_.isEmpty(accountDetails)) {
        return ResponseService.jsonResponse(
          res,
          ConstantService.responseCode.BAD_REQUEST,
          {
            message: ConstantService.responseMessage.ACCOUNT_NOT_FOUND,
          }
        );
      }

      return ResponseService.jsonResponse(
        res,
        ConstantService.responseCode.SUCCESS,
        {
          data: {
            accountDetails: accountDetails,
          },
        }
      );
    } catch (exeception) {
      console.log(exeception);
      return ResponseService.json(
        res,
        ConstantService.responseCode.INTERNAL_SERVER_ERROR,
        ConstantService.responseMessage.ERR_MSG_ISSUE_IN_ACCOUNT_DETAILS_API
      );
    }
  },

  /**
   * User login.
   * API Endpoint :   /user/login
   * API Method   :   POST
   *
   * @param   {Object}        req          Request Object From API Request.
   * @param   {Object}        res          Response Object For API Request.
   * @returns {Promise<*>}    JSONResponse With success code 200 and  information or relevant error code with message.
   */

  userLogin: async (req, res) => {
    try {
      console.info(
        "====================== LOGIN : ACCOUNT REQUEST ==============================\n"
      );
      console.info(
        "HTTP Method - " + req.method + "  |||||||||||  URL - " + req.url + "\n"
      );
      console.info("REQ BODY :", req.body);

      //Extracting account info from request body
      let request = {
        email: req.body.email,
        password: req.body.password,
      };

      //Creating a Valid Schema for request.
      const schema = Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
      });

      //Validating Request with Valid schema.
      const validateResult = schema.validate(request);

      //Returning bad request for invalid request.
      if (validateResult.error) {
        return ResponseService.jsonResponse(
          res,
          ConstantService.responseCode.BAD_REQUEST,
          {
            message: validateResult.error.message,
          }
        );
      }

      let accountDetails = await Account.find({
        email: request.email,
        deletedAt: null,
      }).select("password userId token");

      if (_.isEmpty(accountDetails)) {
        return ResponseService.jsonResponse(
          res,
          ConstantService.responseCode.BAD_REQUEST,
          {
            message: ConstantService.responseMessage.INVALID_CREDENTIALS,
          }
        );
      }

      const isSamePassword = await BcryptService.isSamePassword(
        request.password,
        accountDetails[0].password
      );

      if (!isSamePassword) {
        return ResponseService.jsonResponse(
          res,
          ConstantService.responseCode.BAD_REQUEST,
          {
            message: ConstantService.responseMessage.INVALID_CREDENTIALS,
          }
        );
      }

      let token = await JwtService.sign(accountDetails[0].userId);

      let tokens = accountDetails[0].token
      tokens.push(token.accessToken);

      await Account.updateOne(
        { userId: accountDetails[0].userId },
        {
          token: tokens,
        }
      );

      return ResponseService.jsonResponse(
        res,
        ConstantService.responseCode.SUCCESS,
        {
          message: ConstantService.responseMessage.ACCOUNT_LOGIN_SUCCESS,
          data: {
            token: token.accessToken,
          },
        }
      );
    } catch (exeception) {
      console.log(exeception);
      return ResponseService.json(
        res,
        ConstantService.responseCode.INTERNAL_SERVER_ERROR,
        ConstantService.responseMessage.ERR_MSG_ISSUE_IN_ACCOUNT_LOGIN_API
      );
    }
  },

  /**
   * User logout.
   * API Endpoint :   /user/logout
   * API Method   :   POST
   *
   * @param   {Object}        req          Request Object From API Request.
   * @param   {Object}        res          Response Object For API Request.
   * @returns {Promise<*>}    JSONResponse With success code 200 and  information or relevant error code with message.
   */

  userLogout: async (req, res) => {
    try {
      console.info(
        "====================== LOGOUT : ACCOUNT REQUEST ==============================\n"
      );
      console.info(
        "HTTP Method - " + req.method + "  |||||||||||  URL - " + req.url + "\n"
      );
      console.info("REQ BODY :", req.body);

      await Account.updateOne(
        { userId: req.sessionData.userId },
        {
          token: [],
        }
      );

      return ResponseService.jsonResponse(
        res,
        ConstantService.responseCode.SUCCESS,
        {
          message: ConstantService.responseMessage.ACCOUNT_LOGOUT_SUCCESS,
        }
      );
    } catch (exeception) {
      console.log(exeception);
      return ResponseService.json(
        res,
        ConstantService.responseCode.INTERNAL_SERVER_ERROR,
        ConstantService.responseMessage.ERR_MSG_ISSUE_IN_ACCOUNT_LOGOUT_API
      );
    }
  },
};
