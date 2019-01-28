// Modules
const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      cors = require('cors');

// Files
const mongodb = require('./providers/dbs/mongo.db.js'),
      router = require('./routes/router.js');

// let corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
    
// Basic express configuration
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.options('*', cors());
app.use(cors());
// app.use(function(req, res, next) {
  // res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, content-type, Accept, if-none-match');
// });

// Database
mongodb.connect();

// Router
router.setupRouting(express, app);

module.exports = app;