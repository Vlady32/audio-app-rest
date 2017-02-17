var Comment = require('../models/comment');
var config = require('../../config/database');
var async = require('async');

module.exports = function(apiRoutes) {

  //get all comments
  apiRoutes.get('/comments', function(req, res) {

    Comment.find({trackID: req.query.idTrack}).sort({creationDate: 'desc'}).exec(function(err, comments) {
      if (err) {
        res.json({success: false, msg: "Error in getting comments", error: err.message});
      } else {
        res.json({success: true, msg: comments});
      }
    })

  });

  //add new comment
  apiRoutes.post('/comments', function(req, res) {

    var comment = new Comment({text: req.body.text, login: req.body.login, trackID: req.body.idTrack});

    comment.save(function(err) {
      if (err) {
        res.json({success: false, msg: 'Error in saving comment', error: err.message});
      } else {
        //res.json({success: true, msg: 'Comment has been successfully added'});
        Comment.find({trackID: req.body.idTrack}).sort({creationDate: 'desc'}).exec(function(err, comments) {
          if (err) {
            res.json({success: false, msg: "Error in getting comments", error: err.message});
          } else {
            res.json({success: true, msg: comments});
          }
        })
      }
    });

  });

  //delete comment
  apiRoutes.delete('/comment/:comment_id', function(req, res) {

    Comment.findOneAndRemove({
      _id: req.params.comment_id
    }, function(err) {
      if (err) {
        res.json({success: false, msg: "Comment has not been deleted", error: err.message});
      } else {
        res.json({success: true, msg: "Comment has been successfully deleted"});
      }
    });

  });

  //update comment
  apiRoutes.put('/comments/:comment_id', function(req, res) {

    Comment.findOneAndUpdate({
      _id: req.params.comment_id
    }, {
      login: req.body.login,
      text: req.body.text
    }, function(err, msg) {
      if (err) {
        res.json({success: false, msg: "Comment has not been successfully updated", error: err.message});
      } else {
        res.json({success: true, msg: '"Comment has been successfully updated"'});
      }
    })
  });

};
