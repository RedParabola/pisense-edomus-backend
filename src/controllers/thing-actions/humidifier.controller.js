const processRequest = function (request) {
  console.log(`Callback for thing ${thing.id}/request, running humidifier processRequest`);
};

const processStatus = function (status) {
  console.log(`Callback for thing ${thing.id}/status, running humidifier processStatus`);
};

const processAnswer = function (answer) {
  console.log(`Callback for thing ${thing.id}/answer, running humidifier processAnswer`);
};

const humidifierController = {
  processRequest,
  processStatus,
  processAnswer,
};

module.exports = humidifierController;