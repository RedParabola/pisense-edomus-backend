const ROUTER_CONFIG = require('../../config/router.config.js'),
      userRouter = require('./user.router.js'),
      thingRouter = require('./thing.router.js'),
      boardRouter = require('./board.router.js'),
      roomRouter = require('./room.router.js'),
      linkRouter = require('./link.router.js'),
      measureRouter = require('./measure.router.js');

function _setupRouting(app) {
  app.use(ROUTER_CONFIG.EP_GLOBAL.USER, userRouter);
  app.use(ROUTER_CONFIG.EP_GLOBAL.THINGS, thingRouter);
  app.use(ROUTER_CONFIG.EP_GLOBAL.BOARDS, boardRouter);
  app.use(ROUTER_CONFIG.EP_GLOBAL.ROOMS, roomRouter);
  app.use(ROUTER_CONFIG.EP_GLOBAL.LINKS, linkRouter);
  app.use(ROUTER_CONFIG.EP_GLOBAL.MEASURES, measureRouter);
}

module.exports.setupRouting = _setupRouting;