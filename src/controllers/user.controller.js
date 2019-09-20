var User = require('../models/user.model.js'),
    jwt = require('jsonwebtoken'),
    config = require('../../config/server.config.js');

const _createToken = function (user) {
  return jwt.sign({ id: user.id, email: user.email }, config.JWT_SECRET, {
    expiresIn: config.TOKEN_EXPIRE_TIME
  });
}

const registerUser = function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    console.log('FAILED POST registerUser ' + email);
    res.status(400).send({message: 'You need to send both email and password'});
  } else {
    User.findOne({ email }, (err, user) => {
      if (err) {
        console.log('FAILED POST registerUser ' + email);
        res.status(500).send(err.message);
      } else if (user) {
        console.log('FAILED POST registerUser ' + email);
        res.status(400).send({message: 'User ' + email + ' already exists'});
      } else {
        let newUser = new User(req.body);
        newUser.save((err, user) => {
          if (err) {
            console.log('FAILED POST registerUser ' + email);
            res.status(500).send(err.message);
          } else {
            console.log('SUCCESS POST registerUser ' + email);
            res.status(200).jsonp({message: 'User ' + email + ' registered sucessfully'});
          }
        });
      }
    });
  }
};

const loginUser = function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    console.log('FAILED POST loginUser ' + email);
    res.status(400).send({message: 'You need to send both email and password'});
  } else {
    User.findOne({ email }, (err, user) => {
      if (err) {
        console.log('FAILED POST loginUser ' + email);
        res.status(500).send(err.message);
      } else if (!user) {
        console.log('FAILED POST loginUser ' + email);
        res.status(400).send({message: 'User ' + email + ' does not exist'});
      } else {
        user.comparePassword(password, (err, isMatch) => {
          if (isMatch && !err) {
            console.log('SUCCESS POST loginUser ' + email);
            res.status(200).jsonp({email: email, token: _createToken(user)});
          } else {
            console.log('FAILED POST loginUser ' + email);
            res.status(400).send({message: 'The email and password don\'t match.'});
          }
        });
      }
    });
  }
};

const userController = {
  registerUser,
  loginUser,
};

module.exports = userController;