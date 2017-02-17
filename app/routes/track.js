var Track = require('../models/track');
var Category = require('../models/Category');
var config = require('../../config/database');
var async = require('async');
var multer = require('multer');
var mime = require('mime');
var fs = require('fs');

var uploadTrack = multer({dest: './data/music'});
var uploadImg = multer({dest: './data/img'});

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (file.mimetype.indexOf('audio') !== -1) {
      cb(null, './data/music');
    } else if (file.mimetype.indexOf('image') !== -1) {
      cb(null, './data/img');
    }
  },
  filename: function(req, file, cb) {
    var extArray = file.mimetype.split("/");
    var extension = extArray[extArray.length - 1];
    cb(null, Date.now() + '.' + extension);
  }
});

var upload = multer({storage: storage});

module.exports = function(apiRoutes) {

  //get all tracks
  apiRoutes.get('/tracks', function(req, res) {

    async.waterfall([
      function(callback) {
        if (req.query.search) {
          Track.find({
            name: new RegExp(".*" + req.query.search + '.*', "i")
          }, function(err, tracks) {
            callback(err, tracks);
          })
        } else if (req.query.category == '/recents') {
          Track.find({}).sort({creationDate: 'desc'}).exec(function(err, tracks) {
            callback(err, tracks);
          })
        } else if (req.query.category == '/favorites') {
          Track.find({idsUsersLike: req.decoded._doc.email}).exec(function(err, tracks) {
            callback(err, tracks);
          })
        } else if (req.query.category == '/popular') {
          Track.find({}).sort({countViews: 'desc'}).exec(function(err, tracks) {
            callback(err, tracks);
          })
        } else if (req.query.category) {
          var nameCategory = req.query.category.substring(1);
          Category.find({name: nameCategory}, function(err, category){
            if(!err){
              Track.find({category: category[0]._id}).exec(function(err, tracks) {
                callback(err, tracks);
              })
            }
          })
        }else {
          Track.find({}).sort({countViews: 'desc'}).exec(function(err, tracks) {
            callback(err, tracks);
          })
        }
      },
      function(tracks, callback) {
        Category.find({}, function(err, categories) {
          callback(err, tracks, categories);
        })
      }
    ], function(err, tracks, categories) {
      if (err) {
        res.json({success: false, msg: "Error in getting tracks", error: err.message});
      } else {
        res.json({success: true, msg: tracks, categories: categories});
      }
    });

  });

  //add new track
  apiRoutes.post('/tracks', upload.any(), function(req, res) {

    var staticPath = "http://localhost:8080/";

    var track = new Track({
      name: req.body.trackName,
      urlImg: req.files[1]
        ? (staticPath + "img/" + req.files[1].filename)
        : (staticPath + "img/" + 'default.png'),
      urlTrack: staticPath + "music/" + req.files[0].filename,
      category: req.body.idCategory
    });

    track.save(function(err) {
      if (err) {
        res.json({success: false, msg: 'Error in saving track', error: err.message});
      } else {
        res.json({success: true, msg: 'Track has been successfully added'});
      }
    });

  });

  //update track
  apiRoutes.put('/changeTrack', upload.any(), function(req, res) {

    var staticPath = "http://localhost:8080/";

    var indexImg = -1;
    var indexTrack = -1;

    if (req.files[0] && req.files[0].fieldname == 'trackFile') {
      indexTrack = 0;
    }

    if (req.files[0] && req.files[0].fieldname == 'imgFile') {
      indexImg = 0;
    }

    if (req.files[1] && req.files[1].fieldname == 'imgFile') {
      indexImg = 1;
    }

    Track.find({
      _id: req.body.idTrack
    }, function(err, track) {
      if (!err) {
        if (indexTrack !== -1) {
          fs.unlink('data/' + track[0].urlTrack.substring(track[0].urlTrack.indexOf('music')), function(err) {
            console.log(err);
          });
        }
        if (indexImg !== -1) {
          fs.unlink('data/' + track[0].urlImg.substring(track[0].urlImg.indexOf('img')), function(err) {
            console.log(err);
          });
        }
      }
    })

    Track.findOneAndUpdate({
      _id: req.body.idTrack
    }, {
      name: req.body.trackName,
      urlImg: (indexImg !== -1 && req.files[indexImg])
        ? (staticPath + "img/" + req.files[indexImg].filename)
        : (req.body.imgFile),
      urlTrack: (indexTrack !== -1 && req.files[indexTrack])
        ? (staticPath + "music/" + req.files[indexTrack].filename)
        : (req.body.trackFile),
      category: req.body.idCategory
    }, function(err) {
      console.log(err);
      if (err) {
        res.json({success: false, msg: 'Track has not been updated', error: err.message});
      } else {
        res.json({success: true, msg: 'Track has been successfully updated'});
      }
    });

  });

  //delete track
  apiRoutes.delete('/tracks/:track_id', function(req, res) {

    Track.find({
      _id: req.params.track_id
    }, function(err, track) {
      if (!err) {
        fs.unlink('data/' + track[0].urlTrack.substring(track[0].urlTrack.indexOf('music')), function(err) {
          console.log(err);
        });
        fs.unlink('data/' + track[0].urlImg.substring(track[0].urlImg.indexOf('img')), function(err) {
          console.log(err);
        });
        Track.findOneAndRemove({
          _id: req.params.track_id
        }, function(err) {
          if (err) {
            res.json({success: false, msg: "Track has not been deleted", error: err.message});
          } else {
            res.json({success: true, msg: "Track has been successfully deleted"});
          }
        });
      }
    })

  });

  //update track
  apiRoutes.put('/tracks/:track_id', function(req, res) {

    if (req.body.count) {
      Track.findOneAndUpdate({
        _id: req.params.track_id
      }, {
        $inc: {
          countViews: 1
        }
      }, function(err) {
        if (err) {
          res.json({success: false, msg: 'Track has not been listened', error: err.message});
        } else {
          res.json({success: true, msg: 'This track has been successfully listened'});
        }
      });
    } else if (req.body.like) {

      async.waterfall([

        function(callback) {
          Track.findOne({
            _id: req.params.track_id,
            idsUsersLike: req.body.userId
          }, function(err, track) {
            callback(err, track);
          })
        },

        function(track, callback) {
          if (track) {
            Track.findOneAndUpdate({
              _id: req.params.track_id
            }, {
              $pull: {
                idsUsersLike: req.body.userId
              },
              $inc: {
                countLikes: -1
              }
            }, function(err) {
              callback(err, 'This track has been successfully unliked');
            })
          } else {
            Track.findOneAndUpdate({
              _id: req.params.track_id
            }, {
              $addToSet: {
                idsUsersLike: req.body.userId
              },
              $inc: {
                countLikes: 1
              }
            }, function(err) {
              callback(err, 'This track has been successfully liked');
            })
          }
        }
      ], function(err, msg) {
        if (err) {
          res.json({success: false, msg: msg, error: err.message});
        } else {
          res.json({success: true, msg: msg});
        }
      })

    } else {
      Track.findOneAndUpdate({
        _id: req.params.track_id
      }, {
        name: req.body.name,
        urlImg: req.body.urlImg,
        urlTrack: req.body.urlTrack,
        category: req.body.category
      }, function(err) {
        if (err) {
          res.json({success: false, msg: 'Track has not been updated', error: err.message});
        } else {
          res.json({success: true, msg: 'This track has been successfully updated'});
        }
      });
    }

  });

};
