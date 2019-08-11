const THINGS = {
    // CATEGORY_ENUM : [
    //   'TEMPERATURE',
    //   'LIGHTING',
    //   'ENTERTAINMENT',
    //   'KITCHEN',
    //   'OUTDOOR'
    // ],
    TYPE_ENUM : [
      'LIGHT',
      'AC',
      'HUMIDIFIER',
      'SENSOR',
      // 'HEATER',
      // 'SUNBLIND',
      // 'LIGHT',
      // 'LAMP',
      // 'TV',
      // 'PC',
      // 'HIGHSPEAKER',
      // 'REFRIGERATOR',
      // 'HOOD',
      // 'OUTDOOR'
    ],
    AVAILABLE_MODELS_BY_THING: {
      LIGHT: [
        {model: "Led", id:"led"},
        {model: "RGB Led", id:"rgbled"},
      ],
      AC: [
        {model: "Model-S", id:"Model-S"},
        {model: "Model-C", id:"Model-C"},
        {model: "Model-R", id:"Model-R"},
      ],
      HUMIDIFIER: [
        {model: "Model-S", id:"Model-S"},
        {model: "Model-C", id:"Model-C"},
        {model: "Model-R", id:"Model-R"},
      ],
      SENSOR: [
        {model: "DHT11", id:"dht11"},
        {model: "MQ235", id:"mq235"},
      ]
    }
  };

module.exports = THINGS;