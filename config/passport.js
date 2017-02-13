var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

var User = require('../app/models/user');
var configDB = require('./database');

module.exports = function (passport) {
  var opts = {};
  opts.secretOrKey = configDB.secret;
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({id: jwt_payload}, function (err,user) {
      if(err){
        return done(err,false);
      }
      if(user){
        done(null,user);
      }else{
        done(null,false);
      }
    })
  }))
};
