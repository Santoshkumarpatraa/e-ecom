const express = require("express");
const app = express();
const connectDb = require("./config/mongoConnection");
const dotenv = require("dotenv").config();
const _ = require('lodash');
const cors = require('cors')
const ejs = require('ejs');
const path = require('path')

const ConstantService = require("./api/services/ConstantService");
const ResponseService = require("./api/services/ResponseService");
const BcryptService = require("./api/services/BcryptService");
const JwtService = require("./api/services/JwtService");
const MailService = require("./api/services/MailService");
const customs = require("./config/custom.js");

const port = process.env.PORT || 5001;

app.use(express.json());

//Mongo Connection
connectDb();

//Cors
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "allowedHeaders": 'Content-Type,Authorization',
  "credentials": false,
  "optionsSuccessStatus": 204
}))

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

//Route
app.use("", require("./config/route"));

// Service initializing in the global scope. This allows their usage throughout the entire application.
global._ = _;
global.ConstantService = ConstantService;
global.ResponseService = ResponseService;
global.BcryptService = BcryptService;
global.JwtService = JwtService;
global.MailService = MailService;
global.ejs = ejs;
global.customs = customs;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
