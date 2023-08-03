const express = require("express");
const app = express();
const connectDb = require("./config/mongoConnection");
const dotenv = require("dotenv").config();
var _ = require('lodash');

const ConstantService = require("./api/services/ConstantService");
const ResponseService = require("./api/services/ResponseService");
const BcryptService = require("./api/services/BcryptService");
const JwtService = require("./api/services/JwtService");

const port = process.env.PORT || 1996;

app.use(express.json());
connectDb();

//Route
app.use("", require("./config/route"));

// Service initializing in the global scope. This allows their usage throughout the entire application.
global.ConstantService = ConstantService;
global.ResponseService = ResponseService;
global.BcryptService = BcryptService;
global.JwtService = JwtService;
global._ = _;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
