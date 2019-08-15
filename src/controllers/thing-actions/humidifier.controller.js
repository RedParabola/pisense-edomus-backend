const processRequest = function (thing, request) {
  console.log(`processRequest for humidifier ${thing.id}/request`);
  const requestJSON = request;
  mqttService.publish(thing.id, 'request', JSON.stringify(requestJSON));
};

const processStatus = function (thingId, message) {
  console.log(`processStatus for humidifier ${thingId}/status`);
};

const processAnswer = function (thingId, message) {
  console.log(`processAnswer for humidifier ${thingId}/answer`);
};

const humidifierController = {
  processRequest,
  processStatus,
  processAnswer,
};

module.exports = humidifierController;