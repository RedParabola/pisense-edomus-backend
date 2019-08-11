const processRequest = function (thingId, request) {
  console.log(`processRequest for ac ${thingId}/request`);
  const requestJSON = request;
  mqttService.publish(thingId, 'request', JSON.stringify(requestJSON));
};

const processStatus = function (thingId, message) {
  console.log(`processStatus for ac ${thingId}/status`);
};

const processAnswer = function (thingId, message) {
  console.log(`processAnswer for ac ${thingId}/answer`);
};

const acController = {
  processRequest,
  processStatus,
  processAnswer,
};

module.exports = acController;