const express = require('express'),
      router = express.Router(),
      measureCtrl = require('../controllers/measure.controller.js'),
      ROUTER_CONFIG = require('../../config/router.config.js');

router
  // routing for '/live/:id'
  .get(ROUTER_CONFIG.EP_THINGS.BASE, measureCtrl.getLiveMeasures)

  // routing for '/activate/:id'
  .post(ROUTER_CONFIG.EP_THINGS.BY_ID, measureCtrl.turnHumidifier)

  // routing for '/control/:id'
  .post(ROUTER_CONFIG.EP_THINGS.BY_ID, measureCtrl.setHumidityControl);

module.exports = router;