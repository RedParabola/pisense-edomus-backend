const request = require('request');
      SERVER_CONFIG = require('../../../config/server.config.js');

/**
 * Connection to DB
 */
function _request() {

  request.get('http://192.168.4.15/temp')
  .on('response', function(response, body) {
    console.log(body.success) // 200
    console.log(body.Temperature) // 200
  })
  .on('error', function(response) {
    console.log('ERROR!') // 500
  });

}

module.exports.request = _request;