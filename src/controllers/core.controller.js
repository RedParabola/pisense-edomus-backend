const Thing = require('../models/thing.model.js'),
  mqttService = require('../providers/mqtt/mqtt.service.js'),
  SERVER_CONFIG = require('../../config/server.config.js');

// Retrieve 
const launchStoredSubscriptions = function () {
  const existingMQTTSubscriptions = [];
  Thing.find({}, '-_id, -__v', function (err, things) {
    if (!err) {
      things.forEach(thing => {
        if (thing.linkedRoomId) {
          const subscriptionData = generateSubscriptionData(thing);
          existingMQTTSubscriptions.push(subscriptionData.answer);
          existingMQTTSubscriptions.push(subscriptionData.status);
        }
      });
    }
    mqttService.initializeClient(SERVER_CONFIG.SERVER_ADDRESS, existingMQTTSubscriptions);
  });
};

const generateSubscriptionData = function(thing) {
  const thingControllerInstance = getThingControllerInstance(thing.type);
  return subscriptionData = {
    answer: {
      thing: thing.id,
      endpoint: 'answer',
      callback: thingControllerInstance && thingControllerInstance.processAnswer,
    },
    status: {
      thing: thing.id,
      endpoint: 'status',
      callback: thingControllerInstance && thingControllerInstance.processStatus
    }
  };
}

const getThingControllerInstance = function(thingType) {
  thingType = thingType.toLowerCase();
  const ThingControllerInstance = require(`./thing-actions/${thingType}.controller.js`);
  return ThingControllerInstance;
}

const coreController = {
  launchStoredSubscriptions,
  generateSubscriptionData,
  getThingControllerInstance,
};

module.exports = coreController;