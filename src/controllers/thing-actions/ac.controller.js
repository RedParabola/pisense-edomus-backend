const processRequest = function (request) {
  console.log(`Callback for thing ${thing.id}/request, running ac processRequest`);
};

const processStatus = function (status) {
  console.log(`Callback for thing ${thing.id}/status, running ac processStatus`);
};

const processAnswer = function (answer) {
  console.log(`Callback for thing ${thing.id}/answer, running ac processAnswer`);
};

const acController = {
  processRequest,
  processStatus,
  processAnswer,
};

module.exports = acController;