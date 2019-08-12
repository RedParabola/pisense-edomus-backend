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

// Mock properties depending on thing. Should be retrieved depending on model from real model list
const getModelStructure = function (type, model) {
  var returned;
  switch (type) {
    case 'LIGHT':
      returned = {
        powerType: 'BINARY',
        powerStatus: 'OFF'
      };
      break;
    case 'AC':
      returned = {
        powerStatus: 'OFF',
        intensity: {
          currentValue: 3,
          defaultValue: 1,
          rangeMin: 1,
          rangeMax: 5,
          step: 1
        },
        temperature: {
          currentValue: 22,
          defaultValue: 24,
          rangeMin: 14,
          rangeMax: 34,
          step: 1
        }
      };
      break;
    case 'HUMIDIFIER':
      returned = {
        powerStatus: 'OFF',
        intensity: {
          currentValue: 3,
          defaultValue: 1,
          rangeMin: 1,
          rangeMax: 5,
          step: 1
        },
        waterLevel: {
          currentValue: 22,
          defaultValue: 24,
          rangeMin: 14,
          rangeMax: 34,
          step: 1
        }
      };
      break;
    case 'SENSOR':
      switch (model) {
        case 'dht11':
          returned = {
            powerStatus: 'ON',
            sensorMeasures: {
              temperature: 20,
              humidity: 20
            }
          }
          break;
        case 'mq135':
          returned = {
            powerStatus: 'ON',
            sensorMeasures: {
              airQuality: true
            }
          }
          break;
        default:
          break;
      }

    default:
      break;
  }
  return returned;
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

const getMQ135AvgInfo = function(mq135Sensors) {
  let totalAirQuality,
  warningSensors = [];
  if (mq135Sensors.length) {
    let oneSensorRunningOk,
      allSensorsOk = true;
    mq135Sensors.forEach(sensor => {
      if (sensor.typeProperties && sensor.typeProperties.sensorMeasures) {
        const {airQuality} = sensor.typeProperties.sensorMeasures;
        if (airQuality !== undefined && airQuality !== null) {
          // If here, then the sensor has a value
          oneSensorRunningOk = true;
          if (!airQuality) {
            allSensorsOk = false;
            warningSensors.push(sensor.customName);
          }
        }
      }
    });
    if (oneSensorRunningOk) {
      totalAirQuality = allSensorsOk;
    }
  }
  return {
    airQuality: totalAirQuality,
    warningSensors,
  };
}

const thingHelper = {
  translateCommand,
  getThingControllerInstance,
  generateSubscriptionData,
  getModelStructure,
  getDHT11AvgInfo,
  getMQ135AvgInfo
};

module.exports = thingHelper;