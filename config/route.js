const express = require("express");
const router = express.Router();


// For Server Check/Ping
router.get("/", require("../api/controllers/AccountController").ping);

// HomePage
//router.get("/home", require("../api/controllers/AccountController").ping);

// Account Controller
router.post("/user/add", require("../api/controllers/AccountController").userAdd);
router.put("/user/update", require("../api/policies/Authorized").Authorized, require("../api/controllers/AccountController").userUpdate);
router.delete("/user/delete", require("../api/policies/Authorized").Authorized, require("../api/controllers/AccountController").userDelete);
router.get("/user/details", require("../api/policies/Authorized").Authorized, require("../api/controllers/AccountController").userDetails);
router.post("/user/login", require("../api/controllers/AccountController").userLogin);
router.post("/user/logout", require("../api/policies/Authorized").Authorized, require("../api/controllers/AccountController").userLogout);
router.post("/user/forgot/password", require("../api/controllers/AccountController").userForgotPassword);

module.exports = router;
