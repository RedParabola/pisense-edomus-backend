const express = require('express'),
      router = express.Router(),
      userCtrl = require('../controllers/user.controller.js'),
      ROUTER_CONFIG = require('../../config/router.config.js');

router
  // routing for '/login'
  .post(ROUTER_CONFIG.EP_USER.LOGIN, userCtrl.loginUser)

  // routing for '/register'
  .post(ROUTER_CONFIG.EP_USER.REGISTER, userCtrl.registerUser)

  .get('/special', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({ msg: `Hey ${req.user.email}! I open at the close.` });
});

module.exports = router;