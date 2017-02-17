var User = require('../models/user');
var config = require('../../config/database');
var async = require('async');
var bcrypt = require('bcryptjs');

module.exports = function(apiRoutes) {

  //get all comments
  apiRoutes.get('/users', function(req, res) {

    User.find({}, function(err, users) {
      if (err) {
        res.json({success: false, msg: "Error in getting users", error: err.message});
      } else {
        res.json({success: true, msg: users});
      }
    })

  });

  //delete user
  apiRoutes.delete('/users/:iser_id', function(req, res) {

    User.findOneAndRemove({
      _id: req.params.iser_id
    }, function(err) {
      if (err) {
        res.json({success: false, msg: "User has not been deleted", msg: err.message});
      } else {
        res.json({success: true, msg: "User has been successfully deleted"});
      }
    });

  });

  // update user
  apiRoutes.put('/users/:iser_id', function(req, res) {

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        User.findOneAndUpdate({
          _id: req.params.iser_id
        }, {
          email: req.body.email,
          password: hash,
          status: req.body.status
        }, function(err, msg) {
          if (err) {
            res.json({success: false, msg: "User has not been successfully updated", error: err.message});
          } else {
            res.json({success: true, msg: 'User has been successfully updated'});
          }
        })
      })
    });

  });

};
