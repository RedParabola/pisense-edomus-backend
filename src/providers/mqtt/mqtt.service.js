const mqtt = require('mqtt');
let client,
  _mqttSubscriptions = [];

const initializeClient = function(sourceUrl, existingSubscriptions) {
  console.log('MQTT initializeClient address ' + sourceUrl);
  client = mqtt.connect(sourceUrl);
  client.on('connect', function () {
    console.log('MQTT client initialized, connected to ' + sourceUrl);
    _loadSubscriptions(existingSubscriptions, function() {
      // Start listening
      _initMessageListener();
    });
  })
}

const stopClient = function() {
  client.end();
  console.log('MQTT stopClient');
}

const addSubscription = function(thing, endpoint, callback, successCallback, errorCallback) {
  const topic =_formTopic(thing, endpoint);
  _subscribeTopic(topic, function success() {
    // Add to list of subscriptions _mqttSubscriptions
    const index = _findSubscriptionIndex(thing, endpoint);
    if (index > -1) {
      console.log('MQTT SUCCESS addSubscription subscription to ' + topic + ' already added');
    } else {
      _mqttSubscriptions.push({thing, endpoint, callback});
      console.log('MQTT SUCCESS addSubscription to ' + topic);
    }
    !!successCallback && successCallback();
  }, function error(errMessage) {
    console.log('MQTT FAILED addSubscription to ' + topic + '. Reason:');
    console.log(errMessage);
    !!errorCallback && errorCallback();
  });
}

const removeSubscription = function(thing, endpoint, successCallback, errorCallback) {
  const topic =_formTopic(thing, endpoint);
  _unsubscribeTopic(topic, function success() {
    // Remove from list of subscriptions _mqttSubscriptions
    const index = _findSubscriptionIndex(thing, endpoint);
    if (index > -1) {
      _mqttSubscriptions.splice(index, 1);
      console.log('MQTT SUCCESS removeSubscription to ' + topic);
    } else {
      console.log('MQTT FAILED removeSubscription subscription not found in _mqttSubscriptions.');
    }
    !!successCallback && successCallback();
  }, function error(errMessage) {
    console.log('MQTT FAILED removeSubscription to ' + topic + '. Reason:');
    console.log(errMessage);
    !!errorCallback && errorCallback();
  });
}

const publish = function(thing, successCallback, errorCallback) {
  const topic =_formTopic(thing, 'request');
  _publishTopic(topic, function success() {
    console.log('MQTT SUCCESS publish on ' + topic);
    !!successCallback && successCallback();
  }, function error(errMessage) {
    console.log('MQTT FAILED publish on ' + topic + '. Reason:');
    console.log(errMessage);
    !!errorCallback && errorCallback();
  });
}

const _loadSubscriptions = function(existingSubscriptions, successCallback) {
  const subscriptionsCount = existingSubscriptions.length;
  let processedSubscriptionCounter = 0;
  
  const processSubscription = function() {
    processedSubscriptionCounter++;
    if (processedSubscriptionCounter === subscriptionsCount) {
      successCallback();
    }
  }
  existingSubscriptions.forEach(subscription => {
    addSubscription(
      subscription.thing,
      subscription.endpoint,
      subscription.callback,
      processSubscription, processSubscription
    );
  });
} 

const _subscribeTopic = function(topics, successCallback, errorCallback) {
  client.subscribe(topics, function (err) {
    !err ? successCallback() : errorCallback(err.message);
  })
}

const _unsubscribeTopic = function(topic, successCallback, errorCallback) {
  client.unsubscribe(topic, function (err) {
    !err ? successCallback() : errorCallback(err.message);
  })
}

const _publishTopic = function(topic, message, successCallback, errorCallback) {
  client.publish(topic, message, function (err) {
    !err ? successCallback() : errorCallback(err.message);
  })
}

const _initMessageListener = function() {
  client.on('message', function (topic, payload) {
    // Separate topic into thing and endpoint
    const splitTopic = topic.split('/');
    const thing = !!splitTopic && splitTopic[0];
    const endpoint = !!splitTopic && splitTopic[1];
    // Convert message from Buffer to string
    const message = payload.toString();
    _processMessage(thing, endpoint, message);
  });
}

const _formTopic = function (thing, endpoint) {
  return thing + '/' + endpoint;
}

const _findSubscriptionIndex = function(thing, endpoint) {
  let indexOfSubscription = -1;
  for (let i = 0, len = _mqttSubscriptions.length; i < len; i++) {
    const subscription = _mqttSubscriptions[i];
    if (subscription.thing === thing && subscription.endpoint === endpoint) {
      indexOfSubscription = i;
      break;
    }
  }
  return indexOfSubscription;
}

const _processMessage = function(thing, endpoint, message) {
  const index = _findSubscriptionIndex(thing, endpoint);
  if (index > -1) {
    const subscription = _mqttSubscriptions[index];
    console.log('MQTT SUCCESS _processMessage. Callback ' + _formTopic(thing, endpoint));
    console.log(message);
    subscription.callback(message);
  } else {
    console.log('MQTT FAILED _processMessage not found in _mqttSubscriptions.');
  }
}

const mqttSubscribeService = {
  initializeClient,
  stopClient,
  addSubscription,
  removeSubscription,
  publish
};

module.exports = mqttSubscribeService;