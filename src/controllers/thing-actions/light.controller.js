mqttService = require('../../providers/mqtt/mqtt.service.js');

const processRequest = function (request) {
  console.log(`Callback for thing ${thing.id}/request, running light processRequest`);

  const requestJSON = {
    command: 'light_on',
    parameters: {
      intensity: 1,
      color: '0.1, 0.8, 0.8'
    }
  }
  mqttService.publish(JSON.stringify(requestJSON));
};

const processStatus = function (status) {
  console.log(`Callback for thing ${thing.id}/status, running light processStatus`);
};

const processAnswer = function (answer) {
  console.log(`Callback for thing ${thing.id}/answer, running light processAnswer`);
};

const lightController = {
  processRequest,
  processStatus,
  processAnswer,
};

module.exports = lightController;