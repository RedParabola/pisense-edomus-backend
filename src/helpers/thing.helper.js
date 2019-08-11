const translateCommand = function (commandString, requestedValue) {
  const action = {};
  return action;
};

const getThingControllerInstance = function(thingType) {
  thingType = thingType.toLowerCase();
  const ThingControllerInstance = require(`../controllers/thing-actions/${thingType}.controller.js`);
  return ThingControllerInstance;
}

const generateSubscriptionData = function(thing) {
  const thingControllerInstance = getThingControllerInstance(thing.type);
  return subscriptionData = {
    answer: {
      thingId: thing.id,
      endpoint: 'answer',
      callback: thingControllerInstance && thingControllerInstance.processAnswer,
    },
    status: {
      thingId: thing.id,
      endpoint: 'status',
      callback: thingControllerInstance && thingControllerInstance.processStatus
    }
  };
}

const getDHT11AvgInfo = function(dht11Sensors) {
  let avgTemperature,
    avgHumidity;
  if (dht11Sensors.length) {
    let tempMeasuresCounter = 0,
      humMeasuresCounter = 0,
      addedTemperature = 0,
      addedHumidity = 0;
    dht11Sensors.forEach(sensor => {
      if (sensor.typeProperties && sensor.typeProperties.sensorMeasures) {
        const {temperature, humidity} = sensor.typeProperties.sensorMeasures;
        if (temperature) {
          addedTemperature += temperature;
          tempMeasuresCounter++;
        }
        if (humidity) {
          addedHumidity += humidity;
          humMeasuresCounter++;
        }
      }
    });
    if (tempMeasuresCounter > 0) {
      avgTemperature = addedTemperature/tempMeasuresCounter;
    }
    if (humMeasuresCounter > 0) {
      avgHumidity = addedHumidity/tempMeasuresCounter;
    }
  }
  return {
    temperature: avgTemperature,
    humidity: avgHumidity,
  };
}

const getMQ235AvgInfo = function(mq235Sensors) {
  let avgCO2;
  if (mq235Sensors.length) {
    let co2MeasuresCounter = 0,
      addedCO2 = 0;
    mq235Sensors.forEach(sensor => {
      if (sensor.typeProperties && sensor.typeProperties.sensorMeasures) {
        const {co2} = sensor.sensorMeasures;
        if (co2) {
          addedCO2 += co2;
          co2MeasuresCounter++;
        }
      }
    });
    if (co2MeasuresCounter > 0) {
      avgCO2 = addedCO2/co2MeasuresCounter;
    }
  }
  return {
    co2: avgCO2,
  };
}

const thingHelper = {
  translateCommand,
  getThingControllerInstance,
  generateSubscriptionData,
  getDHT11AvgInfo,
  getMQ235AvgInfo
};

module.exports = thingHelper;