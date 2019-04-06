const express = require('express'),
      router = express.Router(),
      measureCtrl = require('../controllers/measure.controller.js'),
      ROUTER_CONFIG = require('../../config/router.config.js'),
      passport = require('passport');

router
  // routing for '/live/:id'
  .get(
    ROUTER_CONFIG.EP_THINGS.BASE,
    passport.authenticate('jwt', { session: false }),
    measureCtrl.getLiveMeasures)

  // routing for '/activate/:id'
  .post(
    ROUTER_CONFIG.EP_THINGS.BY_ID,
    passport.authenticate('jwt', { session: false }),
    measureCtrl.turnHumidifier)

  // routing for '/control/:id'
  .post(
    ROUTER_CONFIG.EP_THINGS.BY_ID,
    passport.authenticate('jwt', { session: false }),
    measureCtrl.setHumidityControl);

module.exports = router;