const express = require('express'),
      router = express.Router(),
      thingCtrl = require('../controllers/thing.controller.js'),
      ROUTER_CONFIG = require('../../config/router.config.js'),
      passport = require('passport');

router
  // routing for '/'
  .get(
    ROUTER_CONFIG.EP_THINGS.BASE,
    passport.authenticate('jwt', { session: false }),
    thingCtrl.getAllThings)
  .post(
    ROUTER_CONFIG.EP_THINGS.BASE,
    passport.authenticate('jwt', { session: false }),
    thingCtrl.addThing)

  // routing for '/:id'
  .get(
    ROUTER_CONFIG.EP_THINGS.BY_ID,
    passport.authenticate('jwt', { session: false }),
    thingCtrl.getThingById)
  .delete(
    ROUTER_CONFIG.EP_THINGS.BY_ID,
    passport.authenticate('jwt', { session: false }),
    thingCtrl.deleteThing)

  // routing for '/rename/:id'
  .put(
    ROUTER_CONFIG.EP_THINGS.RENAME,
    passport.authenticate('jwt', { session: false }),
    thingCtrl.renameThing)

  // routing for 'command/:id'
  .put(
    ROUTER_CONFIG.EP_THINGS.COMMAND,
    passport.authenticate('jwt', { session: false }),
    thingCtrl.processCommand);

module.exports = router;