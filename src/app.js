// Modules
const express = require('express'),
      bodyParser = require('body-parser'),
      passport = require('passport'),
      methodOverride = require('method-override'),
      cors = require('cors');

// Files
const mongodb = require('./providers/dbs/mongo.db.js'),
      router = require('./routes/router.js'),
      passportMiddleware = require('./middleware/passport.middleware'),
      usbDevices = require('./providers/usb-devices/usb-devices.js');

// let corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
  
// Basic express configuration
const app = express();
app.options('*', cors());
app.use(cors());
// Get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, content-type, Accept, if-none-match');
// });
// Use the passport package in our application
app.use(passport.initialize());
passport.use(passportMiddleware);

// Database
mongodb.connect();

// Router
router.setupRouting(express, app);

// Devices detection
usbDevices.initListening();

module.exports = app;