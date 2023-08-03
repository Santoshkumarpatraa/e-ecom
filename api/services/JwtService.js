const Jwt = require('jsonwebtoken');
const JwtSecret = process.env.JWT_SECRET;
const Account = require("../models/Account");

module.exports = {

    /**
     *
     * @param userId - Id of user
     * @returns {Promise<void>}
     */

    sign: async (userId) => {
        let payload = {
            userId
        };

        let jwtResponse = {};
        jwtResponse.accessToken = Jwt.sign(payload, JwtSecret);

        return jwtResponse;
    },

    /**
     * Verify token.
     *
     * @param token - JWT Token to be verified
     */

    verify: async (token) => {
        try {
            let decoded = await Jwt.verify(token, JwtSecret);
            let accountDetails =  await Account.find({
                userId: decoded.userId,
                deletedAt: null,
              }).select('userId token');

              if (accountDetails[0].token.includes(token)){
                return decoded;
              }
              return {};
        } catch (exception) {
            //console.log(exception);
            return null;
        }
    },

};
