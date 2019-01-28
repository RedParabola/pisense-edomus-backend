const express = require('express'),
      router = express.Router(),
      thingCtrl = require('../controllers/thing.controller.js'),
      ROUTER_CONFIG = require('../../config/router.config.js');

router
  // routing for '/'
  .get(ROUTER_CONFIG.EP_THINGS.BASE, thingCtrl.getAllThings)
  .post(ROUTER_CONFIG.EP_THINGS.BASE, thingCtrl.addThing)

  // routing for '/:id'
  .get(ROUTER_CONFIG.EP_THINGS.BY_ID, thingCtrl.getThingById)
  .delete(ROUTER_CONFIG.EP_THINGS.BY_ID, thingCtrl.deleteThing)

  // routing for '/rename/:id'
  .put(ROUTER_CONFIG.EP_THINGS.RENAME, thingCtrl.renameThing)

  // routing for 'command/:id'
  .put(ROUTER_CONFIG.EP_THINGS.COMMAND, thingCtrl.processCommand);

module.exports = router;