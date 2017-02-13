var jwt = require('jsonwebtoken');
var config = require('../../config/database');

module.exports = function(apiRoutes){

  apiRoutes.use(function(req, res, next) {
    
    if(req.query.category !== '/favorites' || (req.query.idTrack && req.Url.pathname == '/comments/')){
      next();
      return;
    }

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  });
};