const express = require('express'),
      router = express.Router(),
      userCtrl = require('../controllers/user.controller.js'),
      ROUTER_CONFIG = require('../../config/router.config.js');

router
  // routing for '/login'
  .post(ROUTER_CONFIG.EP_USER.LOGIN, userCtrl.loginUser)

  // routing for '/register'
  .post(ROUTER_CONFIG.EP_USER.REGISTER, userCtrl.registerUser);

module.exports = router;