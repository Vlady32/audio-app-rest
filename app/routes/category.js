var Category = require('../models/Category');
var config = require('../../config/database');
var async = require('async');

module.exports = function (apiRoutes) {

  //get all categories
  apiRoutes.get('/categories', function (req, res) {

    Category.find({}, function (err, categories) {
      if(err){
        res.json({success: false, msg: "Error in getting categories", error: err.message});
      }else{
        res.json({success: true, msg: categories});
      }
    })

  });

   //add new category
  apiRoutes.post('/categories', function (req, res) {

    var category = new Category({
      name: req.body.name
    });

    category.save(function (err) {
      if(err){
        res.json({success: false, msg: 'Error in saving category', error: err.message});
      }else {
        res.json({success: true, msg: 'Category has been successfully added'});
      }
    });

  });

  // //get one project
  // apiRoutes.get('/projects/:project_id', function (req, res) {

  //   Project.findOne({_id: req.params.project_id,  userID: req.decoded._doc._id}, function (err, project) {
  //     if(err){
  //       res.json({success: false, msg: "Error in getting project", error: err.message});
  //     }else{
  //       res.json({success: true, msg: project});
  //     }
  //   })

  // });

  // //create new project
  // apiRoutes.post('/projects', function (req, res) {

  //   var newProject = new Project({
  //     name: req.body.name,
  //     description: req.body.description,
  //     userID: req.decoded._doc._id
  //   });

  //   newProject.save(function (err) {
  //     if(err){
  //       res.json({success: false, msg: 'Project already exists'});
  //     }else {
  //       res.json({success: true, msg: 'Project has been successfully added'});
  //     }
  //   });

  // });

  // //delete project
  // apiRoutes.delete('/projects/:ids', function (req, res) {

  //   var projectsIDs = req.params.ids.split(",");

  //   async.waterfall([

  //     function (callback) {
  //       Project.find({_id:{
  //         $in : projectsIDs
  //       } ,userID: req.decoded._doc._id}).remove(function (err) {
  //         callback(err);
  //       })
  //     },

  //     function (callback) {
  //       Sprint.find({projectID: {$in : projectsIDs}}).remove(function (err) {
  //         callback(err);
  //       });
  //     },

  //     function (callback) {
  //       Item.find({projectID: {$in : projectsIDs}}).remove(function (err) {
  //         callback(err);
  //       });
  //     }

  //   ], function (err) {
  //     if(err){
  //       res.json({success: false, msg: "Project(s) have not been deleted", error: err.message});
  //     }else{
  //       res.json({success: true, msg: "Project(s) have been successfully deleted"});
  //     }
  //   });

  // });

  // apiRoutes.put('/projects/:project_id', function (req, res) {

  //   Project.findOneAndUpdate({_id: req.params.project_id, userID: req.decoded._doc._id}, {name: req.body.name, description: req.body.description} ,function (err) {
  //     if(err){
  //       res.json({success: false, msg: 'Project has not been updated', error: err.message});
  //     }
  //     else{
  //       res.json({success: true, msg: 'This project has been successfully updated'});
  //     }
  //   });

  // });

};