var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config/database');

module.exports = function (apiRoutes) {

  apiRoutes.post('/register', function (req, res) {

    if(!req.body.email || !req.body.password){
      res.json({success: false, msg: 'Please pass name and password'});
    }else{
      var newUser = new User({
        email: req.body.email,
        password: req.body.password,
        status: req.body.status
      });
      newUser.save(function (err) {
        if(err){
          res.json({success: false, msg: 'Email already exists'});
        }else {
          res.json({success: true, msg: 'You have been successfully registered'});
        }
      });
    }

  });

  apiRoutes.post('/authenticate', function(req, res) {

    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.send({success: false, msg: 'Authentication failed. User was not found.'});
      } else {
        // check if password matches
        user.comparePasswords(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user, config.secret, {
              expiresIn: "24h" // expires in 24 hours
            });
            res.json({success: true, token: token, email: req.body.email, status: user.status});
          } else {
            res.send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });

  });
};
