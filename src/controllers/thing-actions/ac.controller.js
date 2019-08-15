const processRequest = function (thing, request) {
  console.log(`processRequest for ac ${thing.id}/request`);
  const requestJSON = request;
  mqttService.publish(thing.id, 'request', JSON.stringify(requestJSON));
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