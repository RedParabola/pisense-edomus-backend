const Thing = require('../models/thing.model.js'),
  mqttService = require('../providers/mqtt/mqtt.service.js'),
  SERVER_CONFIG = require('../../config/server.config.js'),
  thingHelper = require('../helpers/thing.helper.js'),
  roomController = require('./room.controller.js'),
  thingController = require('./thing.controller.js');

const prepareCoreInstances = function () {
  console.log('CORE prepareCoreInstances');
  roomController.initializeRooms();
  thingController.initializeThings();
}

const setupCoreMonitors = function () {
  console.log('CORE setupCoreMonitors');
  _launchStoredSubscriptions();
  _releaseDaemons();
}

const _launchStoredSubscriptions = function () {
  console.log('CORE _launchStoredSubscriptions');
  const existingMQTTSubscriptions = [];
  Thing.find({}, '-_id, -__v', function (err, things) {
    if (!err) {
      things.forEach(thing => {
        if (thing.linkedRoomId) {
          const subscriptionData = thingHelper.generateSubscriptionData(thing);
          existingMQTTSubscriptions.push(subscriptionData.answer);
          existingMQTTSubscriptions.push(subscriptionData.status);
        }
      });
    }
    mqttService.initializeClient(SERVER_CONFIG.SERVER_ADDRESS, existingMQTTSubscriptions);
  });
};

const _releaseDaemons = function () {
  console.log('CORE _releaseDaemons');
  setInterval(() => {
    roomController.roomDaemon();
    thingController.thingDaemon();
  }, 5000);
}

const coreController = {
  prepareCoreInstances,
  setupCoreMonitors
};

module.exports = coreController;