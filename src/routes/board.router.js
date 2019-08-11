const express = require('express'),
      router = express.Router(),
      boardCtrl = require('../controllers/board.controller.js'),
      ROUTER_CONFIG = require('../../config/router.config.js'),
      passport = require('passport');

router
  // routing for '/'
  .get(
    ROUTER_CONFIG.EP_BOARDS.BASE,
    passport.authenticate('jwt', { session: false }),
    boardCtrl.getAllBoards)

  // routing for '/detect'
  .get(
    ROUTER_CONFIG.EP_BOARDS.DETECT,
    passport.authenticate('jwt', { session: false }),
    boardCtrl.getUSBConnectedBoard);

module.exports = router;