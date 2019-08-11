mqttService = require('../../providers/mqtt/mqtt.service.js');

const processRequest = function (thingId, request) {
  console.log(`processRequest for light ${thingId}/request`);

/*

{
  command: 'power_on',
}

{
  command: 'power_off',
}

{
  command: 'power_on',
  parameters: {
    status: 1
  }
}

*/

  const requestJSON = {
    command: 'light_on',
    parameters: {
      intensity: 1,
      color: '0.1, 0.8, 0.8'
    }
  }
  mqttService.publish(thingId, 'request', JSON.stringify(requestJSON));
};

const processStatus = function (thingId, message) {
  console.log(`processStatus for light ${thingId}/status`);
};

const processAnswer = function (thingId, message) {
  console.log(`processAnswer for light ${thingId}/answer`);
  let parsedMessage = _parseMessage(message);
  if (parsedMessage) {
    let transcriptedData = _transcriptData(parsedMessage);
    console.log(`Store answer for light ${thingId}/answer`);
    Thing.update({ id: thingId }, {
      $set: {
        typeProperties: transcriptedData
      }
    }, function (err) {
      if (err) {
        console.log(`FAILED processAnswer Thing.update for light ${thingId}/answer`);
      } else {
        console.log(`SUCCESS processAnswer Thing.update for light ${thingId}/answer`);
      }
    });
  }
};

const _parseMessage = function(message) {
  let parsedMessage;
  try {
    parsedMessage = JSON.parse(message);    
  } catch (error) {
    console.log(`Failed parse message for light ${thingId}`);
  }
  return parsedMessage;
}

const _transcriptData = function(data) {
  let transcriptedData = {};
  Object.keys(data).forEach(key => {
    switch (key) {
      case 'command':
        if (data[key] === 'power_on') {
          transcriptedData.powerStatus = 'ON';
        } else if(data[key] === 'power_off') {
          transcriptedData.powerStatus = 'OFF';
        }
        break;
      default:
        break;
    }
  });
  return transcriptedData;
}

const lightController = {
  processRequest,
  processStatus,
  processAnswer,
};

module.exports = lightController;