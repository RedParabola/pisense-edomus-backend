const express = require('express'),
      router = express.Router(),
      linkCtrl = require('../controllers/link.controller.js'),
      ROUTER_CONFIG = require('../../config/router.config.js'),
      passport = require('passport');

router
  // routing for '/'
  .post(
    ROUTER_CONFIG.EP_LINKS.BASE,
    passport.authenticate('jwt', { session: false }),
    linkCtrl.linkRoom)
  .put(
    ROUTER_CONFIG.EP_LINKS.BASE,
    passport.authenticate('jwt', { session: false }),
    linkCtrl.unlinkRoom)

  // routing for '/main'
  .put(
    ROUTER_CONFIG.EP_LINKS.MAIN,
    passport.authenticate('jwt', { session: false }),
    linkCtrl.flagAsMainThing);


module.exports = router;