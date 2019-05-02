const request = require('request');
      SERVER_CONFIG = require('../../../config/server.config.js');

/**
 * Connection to DB
 */
function _request() {

  request.get('http://192.168.1.16/temp')
  .on('response', function(response) {
    console.log(response.success) // 200
    console.log(response.Temperature) // 200
  })
  .on('error', function(response) {
    console.log('ERROR!') // 500
  });

}

module.exports.request = _request;