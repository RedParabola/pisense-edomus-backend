const Thing = require('../../models/thing.model.js'),
  mqttService = require('../../providers/mqtt/mqtt.service.js');

const processRequest = function (thingId, request) {
  console.log(`processRequest for sensor ${thingId}/request`);
  const requestJSON = request;
  mqttService.publish(thingId, 'request', JSON.stringify(requestJSON));
};

const processStatus = function (thingId, message) {
  console.log(`processStatus for sensor ${thingId}/status`);
  let parsedMessage = _parseMessage(message);
  if (parsedMessage) {
    console.log(`Store status for sensor ${thingId}/status`);
    Thing.update({ id: thingId }, {
      $set: {
        typeProperties: {
          sensorMeasures: parsedMessage
        }
      }
    }, function (err) {
      if (err) {
        console.log(`FAILED processStatus Thing.update for sensor ${thingId}/status`);
      } else {
        console.log(`SUCCESS processStatus Thing.update for sensor ${thingId}/status`);
      }
    });
  }
};

const processAnswer = function (thingId, message) {
  console.log(`processAnswer for sensor ${thingId}/answer`);
  let parsedMessage = _parseMessage(message);
  if (parsedMessage) {
    console.log(`Store answer for sensor ${thingId}/answer`);
  }
};

const _parseMessage = function(message) {
  let parsedMessage;
  try {
    parsedMessage = JSON.parse(message);    
  } catch (error) {
    console.log(`Failed parse message for sensor`);
  }
  return parsedMessage;
}

const sensorController = {
  processRequest,
  processStatus,
  processAnswer,
};

module.exports = sensorController;