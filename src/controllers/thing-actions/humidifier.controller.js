const processRequest = function (thingId, request) {
  console.log(`processRequest for humidifier ${thingId}/request`);
  const requestJSON = request;
  mqttService.publish(thingId, 'request', JSON.stringify(requestJSON));
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