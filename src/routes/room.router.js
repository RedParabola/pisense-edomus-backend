const express = require('express'),
      router = express.Router(),
      roomCtrl = require('../controllers/room.controller.js'),
      ROUTER_CONFIG = require('../../config/router.config.js'),
      passport = require('passport');

router
  // routing for '/'
  .get(
    ROUTER_CONFIG.EP_ROOMS.BASE,
    passport.authenticate('jwt', { session: false }),
    roomCtrl.getAllRooms)
  .post(
    ROUTER_CONFIG.EP_ROOMS.BASE,
    passport.authenticate('jwt', { session: false }),
    roomCtrl.addRoom)

  // routing for '/:id'
  .get(
    ROUTER_CONFIG.EP_ROOMS.BY_ID,
    passport.authenticate('jwt', { session: false }),
    roomCtrl.getRoomById)
  .delete(
    ROUTER_CONFIG.EP_ROOMS.BY_ID,
    passport.authenticate('jwt', { session: false }),
    roomCtrl.deleteRoom)

  // routing for '/rename/:id'
  .put(
    ROUTER_CONFIG.EP_ROOMS.RENAME,
    passport.authenticate('jwt', { session: false }),
    roomCtrl.renameRoom);

module.exports = router;