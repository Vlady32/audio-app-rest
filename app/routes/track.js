var Track = require('../models/track');
var Category = require('../models/Category');
var config = require('../../config/database');
var async = require('async');
var multer = require('multer');

var uploadTrack = multer({ dest: './data/music'});
var uploadImg = multer({ dest: './data/img'});

module.exports = function (apiRoutes) {

  //get all tracks
  apiRoutes.get('/tracks', function (req, res) {

    async.waterfall([
      function(callback){
        if(req.query.search){
          Track.find({name: new RegExp("^"+req.query.search+'.*', "i")}, function (err, tracks){
            callback(err, tracks);
          })
        }else if(req.query.category == '/recents'){
          Track.find({}).sort({creationDate: 'desc'}).exec(function (err, tracks){
            callback(err, tracks);
          })
        }else if(req.query.category == '/favorites'){
          Track.find({idsUsersLike: req.decoded._doc.email}).exec(function (err, tracks){
            callback(err, tracks);
          })
        }
        else if(req.query.category == '/popular'){
          Track.find({}).sort({countViews: 'desc'}).exec(function (err, tracks){
            callback(err, tracks);
          })
        }else if(req.query.category == '/trance'){
          Track.find({category: '589ccca1ccb9002124a2f03e'}).exec(function (err, tracks){
            callback(err, tracks);
          })
        }else if(req.query.category == '/chillout'){
          Track.find({category: '589cccc6ccb9002124a2f03f'}).exec(function (err, tracks){
            callback(err, tracks);
          })
        }else{
          Track.find({}).sort({countViews: 'desc'}).exec(function (err, tracks){
            callback(err, tracks);
          })
        }
      },
      function(tracks, callback){
        Category.find({}, function(err, categories){
          callback(err, tracks, categories);
        })
      }
    ], function(err, tracks, categories){
      if(err){
        res.json({success: false, msg: "Error in getting tracks", error: err.message});
      }else{
        res.json({success: true, msg: tracks, categories: categories});
      }
    });

  });

   //add new track
  apiRoutes.post('/tracks', uploadTrack.single('trackFile'), function (req, res, next) {

    console.log('Track saved');
    // next();

    // console.log('files: ', req.files);
    // console.log('data: ', req.body);
    //upload.single('trackFile');


    // console.log(req.body);


    // res.end(req.file);



    // console.log(req.body);

    // console.log(req.body.trackFile);
    // var buf = new Buffer(req.body.trackFile.preview, 'base64');
    //
    // fs.writeFile("data/tracks/1.mp3", buf, function(err) {
    //   if(err) {
    //     console.log("err", err);
    //   } else {
    //     console.log('suc');
    //     return res.json({'status': 'success'});
    //   }
    // })

    // var track = new Track({
    //   name: req.body.name,
    //   urlImg: req.body.urlImg,
    //   urlTrack: req.body.urlTrack,
    //   category: req.body.category
    // });
    //
    // track.save(function (err) {
    //   if(err){
    //     res.json({success: false, msg: 'Error in saving track', error: err.message});
    //   }else {
    //     res.json({success: true, msg: 'Track has been successfully added'});
    //   }
    // });

  });

  apiRoutes.post('/tracks', uploadImg.single('imgFile'), function (req, res, next) {

    console.log('Img saved');

  });



  //delete track
  apiRoutes.delete('/tracks/:track_id', function (req, res) {

    Track.findOneAndRemove({_id: req.params.track_id}, function (err) {
      if(err){
        res.json({success: false, msg: "Track has not been deleted", error: err.message});
      }else{
        res.json({success: true, msg: "Track has been successfully deleted"});
      }
    });

  });

  //update track
  apiRoutes.put('/tracks/:track_id', function (req, res) {

    if(req.body.count){
      Track.findOneAndUpdate({
        _id: req.params.track_id
      },
      {
        $inc: { countViews: 1}
      } ,function (err) {
        if(err){
          res.json({success: false, msg: 'Track has not been listened', error: err.message});
        }
        else{
          res.json({success: true, msg: 'This track has been successfully listened'});
        }
      });
    }else if(req.body.like){

      async.waterfall([

        function(callback){
          Track.findOne({_id: req.params.track_id, idsUsersLike: req.body.userId}, function(err, track){
            callback(err, track);
          })
        },

        function(track, callback){
          if(track){
            Track.findOneAndUpdate({
              _id: req.params.track_id
            },
            {
              $pull: { idsUsersLike: req.body.userId },
              $inc: { countLikes: -1}
            },
            function(err){
              callback(err, 'This track has been successfully unliked');
            })
          }
          else{
            Track.findOneAndUpdate({
              _id: req.params.track_id
            },
            {
              $addToSet: {
                idsUsersLike : req.body.userId
              },
              $inc: { countLikes: 1}
            },
            function(err){
              callback(err, 'This track has been successfully liked');
            })
          }
        }],
        function(err, msg){
          if(err){
            res.json({success: false, msg: msg, error: err.message});
          }
          else{
            res.json({success: true, msg: msg});
          }
        }
      )

    }else{
      Track.findOneAndUpdate({
        _id: req.params.track_id
      },
      {
        name: req.body.name,
        urlImg: req.body.urlImg,
        urlTrack: req.body.urlTrack,
        category: req.body.category
      } ,function (err) {
        if(err){
          res.json({success: false, msg: 'Track has not been updated', error: err.message});
        }
        else{
          res.json({success: true, msg: 'This track has been successfully updated'});
        }
      });
    }

  });



};
