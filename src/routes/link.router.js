const express = require('express'),
      router = express.Router(),
      linkCtrl = require('../controllers/link.controller.js'),
      ROUTER_CONFIG = require('../../config/router.config.js');

router
  // routing for '/'
  .post(ROUTER_CONFIG.EP_LINKS.BASE, linkCtrl.linkRoom)
  .put(ROUTER_CONFIG.EP_LINKS.BASE, linkCtrl.unlinkRoom)

  // routing for '/main'
  .put(ROUTER_CONFIG.EP_LINKS.MAIN, linkCtrl.flagAsMainThing);


module.exports = router;