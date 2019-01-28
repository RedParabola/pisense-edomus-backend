const express = require('express'),
      router = express.Router(),
      roomCtrl = require('../controllers/room.controller.js'),
      ROUTER_CONFIG = require('../../config/router.config.js');

router
  // routing for '/'
  .get(ROUTER_CONFIG.EP_ROOMS.BASE, roomCtrl.getAllRooms)
  .post(ROUTER_CONFIG.EP_ROOMS.BASE, roomCtrl.addRoom)

  // routing for '/:id'
  .get(ROUTER_CONFIG.EP_ROOMS.BY_ID, roomCtrl.getRoomById)
  .delete(ROUTER_CONFIG.EP_ROOMS.BY_ID, roomCtrl.deleteRoom)

  // routing for '/rename/:id'
  .put(ROUTER_CONFIG.EP_ROOMS.RENAME, roomCtrl.renameRoom);

module.exports = router;