// Modules
const express = require('express'),
      bodyParser = require('body-parser'),
      passport = require('passport'),
      methodOverride = require('method-override'),
      cors = require('cors'),

// Files
      mongodb = require('./providers/dbs/mongo.db.js'),
      router = require('./routes/router.js'),
      passportMiddleware = require('./middleware/passport.middleware.js'),
      usbService = require('./providers/usb/usb.service.js'),
      mqttService = require('./providers/mqtt/mqtt.service.js'),
      SERVER_CONFIG = require('../config/server.config.js');


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
usbService.initListening();




const existingMQTTSubscriptions = [
  {
    thing: 'salon/dht11',
    measure: 'temp',
    callback: function() { console.log('Callback for thing salon/dht11/temp'); },
  },
  {
    thing: 'cocina/dht11',
    measure: 'temp',
    callback: function() { console.log('Callback for thing cocina/dht11/temp'); },
  },
  {
    thing: 'salon/pir',
    measure: 'movement',
    callback: function() { console.log('Callback for thing salon/pir/movement'); },
  },
  {
    thing: 'salon/test',
    measure: 'msg',
    callback: function() { console.log('Callback for thing salon/test/msg'); },
  },
];




mqttService.initializeClient(SERVER_CONFIG.SERVER_ADDRESS, existingMQTTSubscriptions);
module.exports = app;