const Thing = require('../../models/thing.model.js'),
  mqttService = require('../../providers/mqtt/mqtt.service.js');

const _cachedMqttRequests = {};

const processRequest = function (thing, request, successCallback, errorCallback) {
  console.log(`processRequest for light ${thing.id}/request`);
  if (_arePropertiesAlreadyLoaded(thing, request)) {
    successCallback();
  } else {
    const stringifiedRequest = JSON.stringify(request);
    _cacheRequestFlow(thing.id, stringifiedRequest, successCallback, errorCallback);
    mqttService.publish(thing.id, 'request', stringifiedRequest);
  };
};

const processStatus = function (thingId, message) {
  console.log(`processStatus for light ${thingId}/status`);
};

const processAnswer = function (thingId, message) {
  console.log(`processAnswer for light ${thingId}/answer`);
  let parsedMessage = _parseMessage(message);
  if (parsedMessage) {
    // Proceed with stored http request flows
    _loadRequestFlow(thingId, parsedMessage);
    // Update DB with changes with the expected structure.
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

const _cacheRequestFlow = function (thingId, stringifiedRequest, successCallback, errorCallback) {
  const thingIdAndRequest = thingId + stringifiedRequest;
  // Identify if there was a previous request, and if so, reject it.
  const storedRequest = _cachedMqttRequests[thingIdAndRequest];
  if (storedRequest) {
    storedRequest.errorCallback();
  }
  // Cache the request flow
  _cachedMqttRequests[thingIdAndRequest] = {
    successCallback, errorCallback
  };
}

const _loadRequestFlow = function (thingId, parsedMessage) {
  // Identify the answer.
  const messageBase = {
    command: parsedMessage.command,
    parameters: parsedMessage.parameters,
  };
  const thingIdAndRequest = thingId + JSON.stringify(messageBase);
  const storedRequest = _cachedMqttRequests[thingIdAndRequest];
  if (storedRequest) {
    storedRequest.successCallback();
    _cachedMqttRequests[thingIdAndRequest] = undefined;
  }
}

const _arePropertiesAlreadyLoaded = function (storedThing, request) {
  const allKeysAlreadyLoaded = true;
  const storedProperties = storedThing.typeProperties;
  const expectedProperties = _transcriptData(request);
  Object.keys(expectedProperties).forEach(property => {
    if (expectedProperties[property] !== storedProperties[property]  ) {
      allKeysAlreadyLoaded = false;
    }
  });
  return allKeysAlreadyLoaded;
}

const lightController = {
  processRequest,
  processStatus,
  processAnswer,
};

module.exports = lightController;