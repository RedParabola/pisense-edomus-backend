const Measure = require('../models/measure.model.js'),
      Python = require('../providers/scripts/python.service.js');

//GET - Return the live measures
const getLiveMeasures = function(req, res) {
  Python.getLiveMeasures(function (err, results) {
    if(err){
      console.log('FAILED GET getLiveMeasures');
      console.log('Error is: ' + err.message);
      res.status(500).send(err.message);
    }else{
      console.log('SUCCESS GET getLiveMeasures');
      // results is an array consisting of messages collected during execution
      res.status(200).jsonp(results);
      console.log(results);
    }
  });
};

//POST - Set humidifier
const turnHumidifier = function(req, res) {
  _setHumidifier(req, res, req.body.power);  
};

//POST - Set humidity Control
const setHumidityControl = function(req, res) {
  Measure.findOne({room : req.body.roomId}, function(err, measure) {
    if(err){
      console.log('FAILED GET last measure for ' + req.body.roomId);
      res.status(500).send(err.message);
    }else{
      console.log('SUCCESS GET room humidity ' + measure.humidity);
      var turnOn = (measure.humidity < req.body.thresholdmin ) ? true : false;
      _setHumidifier(req, res, turnOn);
    }
  });
};

function _setHumidifier(req, res, power) {
  Python.setHumidifier(power,function (err, results) {
    if(err){
      console.log('FAILED POST setHumidifier ' + power);
      console.log('Error is: ' + err.message);
      res.status(500).send(err.message);
    }else{
      console.log('SUCCESS POST setHumidifier ' + power);
      console.log(results);
      res.status(200).jsonp(results);
    }
  });
};

const measureController = {
  getLiveMeasures,
  turnHumidifier,
  setHumidityControl
};

module.exports = measureController;